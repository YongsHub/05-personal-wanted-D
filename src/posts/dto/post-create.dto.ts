import { IsArray, IsString } from 'class-validator';

export class PostCreateDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsArray()
  hashtags: string[];
}
