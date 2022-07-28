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

  @ManyToMany(() => HashTag)
  @JoinTable()
  hashtags: HashTag[];
}
