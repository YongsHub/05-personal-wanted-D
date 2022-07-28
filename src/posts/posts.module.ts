import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { HashTag } from './entity/hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Post, HashTag])],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
