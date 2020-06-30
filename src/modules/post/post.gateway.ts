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

@WebSocketGateway()
export class PostGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private postService: PostService,
    private userService: UserService,
    private forumService: ForumService,
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
  }
}
