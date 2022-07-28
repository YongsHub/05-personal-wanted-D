import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostCreateDto } from './dto/post-create.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(@Body() createPostDto: PostCreateDto) {
    return this.postService.createPost(createPostDto);
  }
}
