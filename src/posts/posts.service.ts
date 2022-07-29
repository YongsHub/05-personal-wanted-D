import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
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

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   *  게시물 생성 함수
   */
  async createPost(userId: number, createPostDto: PostCreateDto) {
    const { title, content, hashtags } = createPostDto;
    //console.log(`제목:${title}`, `내용:${content}`, `해시태그: ${hashtags}`);
    const tags = await this.hashtagsRepository.findBy({ title: In(hashtags) });
    const user = await this.userRepository.findOne({ where: { id: userId } });
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
    console.log(user);
    post.user = user;

    await this.postsRepository.save(post);
  }
}
