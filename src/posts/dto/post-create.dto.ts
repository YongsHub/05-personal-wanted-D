import { IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  hashtags: string;
}
