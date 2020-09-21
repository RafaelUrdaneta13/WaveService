import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PostDto } from 'src/dto/post.dto';
import { PostService } from './post.service';
import { UserService } from '../user/user.service';
import { Post as PostEntity } from '../../../entities/post.entity';
import { ForumService } from '../forum/forum.service';
import { SubscriberService } from '../subscriber/subscriber.service';

import webpush = require('web-push');

const vapidKeys = {
  publicKey:
    'BBhlu3acwvyKzAoGjCFFmPvcjp22i275SExmGcnxNEalSaKYz5XzhpH-fZy123SUaSU1tFpXSh5Jyi-aV3Ju5as',
  privateKey: 'Wf1BlmC1WznIDDgJubSFJEm37MJQVb3JnVYHXyf_PXA',
};

webpush.setVapidDetails(
  'mailto:wavemetrosoftware@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

@WebSocketGateway()
export class PostGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private forumService: ForumService,
    private subscriberService: SubscriberService,
  ) {}

  @SubscribeMessage('posts')
  async newPost(@MessageBody() data: PostDto) {
    const forum = await this.forumService.findById(data.foroId);
    const user = await this.userService.findOne(data.email);
    const post: PostEntity = new PostEntity({
      text: data.text,
      forum: forum,
      user,
    });

    const savedPost = await this.postService.savePost(post);
    this.server.emit(`forum-${data.foroId}`, savedPost);
    this.sentPushNotifications(post);
  }

  async sentPushNotifications(post: PostEntity) {
    try {
      const users = (
        await this.forumService.findByIdWithUsers(post.forum.id)
      ).users.filter(user => user.email !== post.user.email);
      let subscribers: any = await this.subscriberService.getSubscribersByUsers(
        users.map(user => user.email),
      );
      const notificationPayload = {
        notification: {
          title: `New post on ${post.forum.title}`,
          body: ` ${post.user.userName}: ${post.text}`,
          icon: 'https://i.ibb.co/8NHQJ4L/logo.png',
          vibrate: [100, 50, 100],
          data: {
            dateOfArrival: Date.now(),
            primaryKey: 1,
            foro: post.forum.id,
          },
          actions: [
            {
              action: `REDIRECT`,
              title: 'Go to the forum',
            },
          ],
        },
      };
      subscribers = subscribers.map(sub => ({
        endpoint: sub.endpoint,
        expirationTime: null,
        keys: {
          p256dh: sub.encriptionKey,
          auth: sub.authSecret,
        },
      }));
      Promise.all(
        subscribers.map(sub =>
          webpush.sendNotification(sub, JSON.stringify(notificationPayload)),
        ),
      )
        .then(() => console.log('push notifications sent successfully'))
        .catch(err => {
          console.error('Error sending notification, reason: ', err);
        });
    } catch (error) {
      console.log(error);
    }
  }
}
