import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class PostInfoDto {
  constructor(
    title: string,
    userEmail: string,
    hashtags: object[],
    createdAt: Date,
    likeCount: number,
    visitedCount: number,
  ) {
    this.title = title;
    this.userEmail = userEmail;
    this.hashtags = hashtags;
    this.createdAt = createdAt;
    this.likeCount = likeCount;
    this.visitedCount = visitedCount;
  }
  @IsString()
  title: string;

  @IsString()
  userEmail: string;

  @IsArray()
  hashtags: object[];

  @IsDate()
  createdAt: Date;

  @IsNumber()
  likeCount: number;

  @IsNumber()
  visitedCount: number;
}
