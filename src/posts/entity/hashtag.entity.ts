import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
@Unique(['title'])
export class HashTag {
  constructor(title: string) {
    this.title = title;
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;
}
