import { Token } from 'src/auth/entity/token.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

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
}
