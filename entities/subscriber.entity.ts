import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Subscriber {
  @OneToOne(() => User, { primary: true })
  @JoinColumn()
  user: User;

  @Column()
  endpoint: string;

  @Column()
  encriptionKey: string;

  @Column()
  authSecret: string;
}
