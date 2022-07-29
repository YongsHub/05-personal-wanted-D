import { User } from '../../users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HashTag } from './hashtag.entity';

@Entity()
export class Post {
  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  visitedCount: number;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToMany(() => HashTag)
  @JoinTable()
  hashtags: HashTag[];
}
