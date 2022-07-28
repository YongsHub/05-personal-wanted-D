import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HashTag } from './hashtag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  likeCount: number;

  @Column()
  visitedCount: number;

  @ManyToMany(() => HashTag)
  @JoinTable()
  hashtags: HashTag[];
}
