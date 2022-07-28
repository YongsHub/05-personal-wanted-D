import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { HashTag } from './entity/hashtag.entity';
import { Post } from './entity/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(HashTag)
    private hashtagsRepository: Repository<HashTag>,
  ) {}

  async createPost(createPostDto: PostCreateDto) {
    const { title, content, hashtags } = createPostDto;
    //console.log(`제목:${title}`, `내용:${content}`, `해시태그: ${hashtags}`);
    const tag = await this.hashtagsRepository.findBy({ title: In(hashtags) });
    console.log(tag);
  }
}
