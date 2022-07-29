import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { User as CurrentUser } from 'src/auth/user-decorator';
import { User } from '../users/entity/user.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostCreateDto } from './dto/post-create.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  createPost(
    @CurrentUser('userId') userId: number,
    @Body() createPostDto: PostCreateDto,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }
}
