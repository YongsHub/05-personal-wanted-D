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
    const tags = await this.hashtagsRepository.findBy({ title: In(hashtags) });
    const tagsList: HashTag[] = [];
    let newHashTag: HashTag;
    hashtags.forEach(async (hashtag) => {
      let isExist = false;
      tags.forEach((tag) => {
        if (tag.title === hashtag) {
          isExist = true;
          newHashTag = tag;
        }
      });
      if (!isExist) {
        newHashTag = new HashTag(hashtag);
        await this.hashtagsRepository.save(newHashTag);
        tagsList.push(newHashTag);
      } else {
        tagsList.push(newHashTag);
      }
    });

    const post = new Post(title, content);
    post.hashtags = tagsList;

    await this.postsRepository.save(post);
  }
}
