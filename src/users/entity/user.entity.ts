import { Token } from '../../auth/entity/token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Post } from '../../posts/entity/post.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Token, { lazy: true })
  token: Token;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
