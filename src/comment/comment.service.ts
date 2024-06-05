import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCommentDto } from './dto/updateComment.dto';

@Injectable()
export class CommentService {
    constructor(private readonly  prismaService : PrismaService){}
    async create(createCommentDto: CreateCommentDto, userId: any) {
        const {title, body, postId} = createCommentDto;
        const post = await this.prismaService.post.findUnique({where : {postID : postId}});
        if (!post) throw new NotFoundException("Post not found");

        await this.prismaService.comment.create({data: {title,body,postId,userId}});
        return {data: "comment successfully created"};
    }
    async getAll() {
        return this.prismaService.comment.findMany({
            select : {
                title:true,
                body:true,
                userId:true ,
                user : {
                    select : {
                        username : true,
                        email : true,
                    }
                },
                postId:true,
                post : {
                    include : {
                        user : {
                            select : {
                                username : true, 
                                email : true,
                            }
                        }
                    }
                },
            }
        });
    }
    async delete(commentId: number, userId: any, postId: number) {
        const comment = await this.prismaService.comment.findUnique({where : {commentID:commentId}});
        if (!comment) throw new NotFoundException("Comment not found");
        if(comment.postId !== postId) throw new UnauthorizedException("post id does not match");
        if(comment.userId !== userId) throw new ForbiddenException("Forbidden action");
        await this.prismaService.comment.delete({where : {commentID:commentId}});
        return { data : "comment successfully deleted"}
    }
    async update(commentId: number, updateCommentDto: UpdateCommentDto, userId: any) {
        const {postId} = updateCommentDto
        const comment = await this.prismaService.comment.findUnique({where:{commentID:commentId}});
        if (!comment) throw new NotFoundException("Comment not found")
        if (comment.postId !== postId ) throw new UnauthorizedException("post not found") ; 
        console.log("postId",postId);
        console.log("PostId dans BD",comment.postId);
        if(comment.userId !== userId) throw new ForbiddenException("Forbidden action");
        await this.prismaService.comment.update({where : {commentID:commentId},
            data: { ...updateCommentDto },
        });
        return {data : "comment updated successfully"};
    }
    
}
