import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entity/post.entity';
import { HashTag } from './entity/hashtag.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post, HashTag]), UsersModule],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule {}
