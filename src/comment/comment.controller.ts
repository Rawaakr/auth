import { AuthGuard } from '@nestjs/passport';
import { CommentService } from './comment.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from './dto/createComment.dto';
import { Request } from 'express';
import { UpdateCommentDto } from './dto/updateComment.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()	
@ApiTags("Comments")
@Controller('comments')
export class CommentController {
    constructor(private readonly commentService : CommentService){}
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createCommentDto : CreateCommentDto,@Req() request : Request){
        const userId = request.user["userID"]
        return this.commentService.create(createCommentDto,userId);
    }
    @UseGuards(AuthGuard("jwt"))
    @Get("")
    getAll(){
        return this.commentService.getAll();
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id",ParseIntPipe) commentId : number,@Req() request : Request,@Body("postId") postId : number){
        const userId = request.user["userID"];
        return this.commentService.delete(commentId,userId,postId)
    }

    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id",ParseIntPipe) commentId : number,@Body() updateCommentDto: UpdateCommentDto,@Req() request : Request){
        const userId = request.user["userID"];
        return this.commentService.update(commentId , updateCommentDto,userId);
    }
    
}
