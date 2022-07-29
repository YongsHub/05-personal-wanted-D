import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { User as CurrentUser } from 'src/auth/user-decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostCreateDto } from './dto/post-create.dto';
import { PostsService } from './posts.service';
import { HttpExceptionFilter } from 'src/http-exception.filter';

@Controller('posts')
@UseFilters(new HttpExceptionFilter())
export class PostsController {
  constructor(private postService: PostsService) {}

  @UseGuards(JwtAuthGuard) // 토큰 유효한지 검사하는 Guard
  @Post()
  createPost(
    @CurrentUser('userId') userId: number,
    @Body() createPostDto: PostCreateDto,
  ) {
    return this.postService.createPost(userId, createPostDto);
  }

  @Get()
  getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get('/:postId')
  getPostDetail(@Param('postId', ParseIntPipe) postId: number) {
    return this.postService.getPostDetail(postId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deletePost(
    @CurrentUser('userId') userId: number,
    @Query('postId') postId: number,
  ) {
    return this.postService.deletePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/:postId')
  restorePost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser('userId') userId: number,
  ) {
    return this.postService.restorePost(userId, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  updatePostLikeCount(
    @Query('postId') postId: number,
    @Query('key') key: boolean,
  ) {
    return this.postService.updatePostLikeCount(postId, key);
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:postId')
  updatePostByUserId(
    @CurrentUser('userId') userId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() createPostDto: PostCreateDto,
  ) {
    return this.postService.updatePostByUserId(userId, postId, createPostDto);
  }
}
