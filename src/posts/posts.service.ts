import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { DataSource, In, Repository } from 'typeorm';
import { PostCreateDto } from './dto/post-create.dto';
import { HashTag } from './entity/hashtag.entity';
import { Post } from './entity/post.entity';
import { PostInfoDto } from './dto/post-info.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,

    @InjectRepository(HashTag)
    private hashtagsRepository: Repository<HashTag>,

    @InjectRepository(User)
    private userRepository: Repository<User>,

    private dataSource: DataSource,
  ) {}

  /**
   *  게시물 생성 함수
   */
  async createPost(userId: number, createPostDto: PostCreateDto) {
    const { title, content, hashtags } = createPostDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const post = new Post(title, content);
    post.hashtags = await this.filteringHashTag(hashtags);
    post.user = Promise.resolve(user);

    await this.postsRepository.save(post);
  }

  /**
   * 게시물 전체 리스트
   */
  async getAllPosts() {
    const posts: PostInfoDto[] = [];
    const result = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.email'])
      .innerJoinAndSelect('user.posts', 'post')
      .innerJoinAndSelect('post.hashtags', 'hashtag')
      .getMany();
    result.forEach((user) => {
      user.posts.forEach((post) => {
        posts.push(
          new PostInfoDto(
            post.title,
            user.email,
            post.hashtags,
            post.createdAt,
            post.likeCount,
            post.visitedCount,
          ),
        );
      });
    });
    return posts;
  }
  /**
   * 게시물 상세보기
   */
  async getPostDetail(postId: number) {
    const post = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.hashtags', 'hashtag')
      .where('post.id = :postId', { postId: postId })
      .getOne();

    if (!post) throw new NotFoundException('존재하지 않는 게시물입니다.');
    await post.user;

    post.visitedCount += 1;
    await this.postsRepository.save(post);
    return post;
  }

  /**
   * 게시물 삭제
   */
  async deletePost(userId: number, postId: number) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('존재하지 않는 게시물입니다.');
    }
    const user = await post.user;

    if (userId !== user.id) {
      throw new UnauthorizedException();
    } else {
      await this.postsRepository.softDelete(postId);
      return {
        statusCode: 200,
        message: '게시물이 삭제되었습니다',
      };
    }
  }

  /**
   * 게시물 복구
   */
  async restorePost(userId: number, postId: number) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.restore(Post, postId);
      const post = await queryRunner.manager.findOne(Post, {
        where: { id: postId },
      });
      const user = await post.user;
      if (userId !== user.id) {
        throw new UnauthorizedException('유저의 해당 게시물이 아닙니다.');
      }
      await queryRunner.commitTransaction();
      return {
        statusCode: 200,
        message: '게시물이 복구되었습니다.',
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      return err.response;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 게시물 좋아요 누르기 및 좋아요 취소
   */
  async updatePostLikeCount(postId: number, key: boolean) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException();
    } else {
      console.log(key);
      if (key) {
        post.likeCount += 1;
      } else {
        if (post.likeCount >= 1) {
          post.likeCount -= 1;
        }
      }
      await this.postsRepository.save(post);
      return {
        success: true,
        message: '성공적으로 실행되었습니다.',
      };
    }
  }

  /**
   * 게시물 수정
   */
  async updatePostByUserId(
    userId: number,
    postId: number,
    createPostDto: PostCreateDto,
  ) {
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    const user = await post.user;

    if (user.id !== userId)
      throw new UnauthorizedException('user정보가 일치하지 않습니다.');

    const { title, content, hashtags } = createPostDto;
    post.title = title;
    post.content = content;
    post.hashtags = await this.filteringHashTag(hashtags);

    await this.postsRepository.save(post);
    return {
      success: 'true',
      message: '성공적으로 수정되었습니다.',
    };
  }

  /**
   * 해시태그 중복 처리 함수
   */
  async filteringHashTag(hashtag: string): Promise<HashTag[]> {
    const hashtags = hashtag.split(',');
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
        tagsList.push(newHashTag);
      } else {
        tagsList.push(newHashTag);
      }
    });

    return tagsList;
  }
}
