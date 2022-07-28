import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Token {
  constructor(token: string) {
    this.token = token;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token!: string;

  @Column()
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
