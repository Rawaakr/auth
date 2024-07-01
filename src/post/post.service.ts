import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAll() {
    return await this.prismaService.post.findMany({
      include: {
        user: {
          select: {
            username: true,
            email: true,
          },
        },
        comments: {
          select: {
            title: true,
            body: true,
            user : {
                select : {
                    username: true , 
                    email : true,
                }
                }
            }
          },
        }
      })
    }
  async create(createPostDto: CreatePostDto, userId?: any) {
    const { title, body } = createPostDto;
    await this.prismaService.post.create({ data: { title, body, userId } });
    return { data: 'Post Created' };
  }
  async delete(postId: number, userId: any) {
    const post = await this.prismaService.post.findUnique({
      where: { postID: postId },
    });
    if (!post) throw new NotFoundException('Post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.delete({
      where: { postID: postId },
    });
    return { data: 'post successfully deleted' };
  }
  async update(postId: number, updatePostDto: UpdatePostDto, userId: any) {
    const post = await this.prismaService.post.findUnique({
      where: { postID: postId },
    });
    if (!post) throw new NotFoundException('post not found');
    if (post.userId !== userId)
      throw new ForbiddenException('Forbidden action');
    await this.prismaService.post.update({
      where: { postID: postId },
      data: { ...updatePostDto },
    });
    return { data : "Post successfully updated "}
  }
}
