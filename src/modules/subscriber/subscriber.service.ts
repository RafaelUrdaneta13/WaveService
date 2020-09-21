import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscriber } from 'entities/subscriber.entity';
import { Repository, In } from 'typeorm';

@Injectable()
export class SubscriberService {
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>,
  ) {}

  saveSubscriber(subscriber: Subscriber): Promise<Subscriber> {
    return this.subscriberRepository.save(subscriber);
  }

  getSubscribersByUsers(usersEmail: string[]): Promise<Subscriber[]> {
    return this.subscriberRepository.find({
      where: {
        user: In(usersEmail),
      },
    });
  }
}
