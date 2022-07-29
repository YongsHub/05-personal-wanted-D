import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
@Entity()
export class Token {
  constructor(token: string) {
    this.token = token;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
