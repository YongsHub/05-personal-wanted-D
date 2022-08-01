import { Token } from '../../auth/entity/token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
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
  @JoinColumn()
  token: Promise<Token>;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
