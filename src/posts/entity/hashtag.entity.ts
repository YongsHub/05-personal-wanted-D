import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HashTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
