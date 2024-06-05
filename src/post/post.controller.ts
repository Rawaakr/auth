import { AuthGuard } from '@nestjs/passport';
import { PostService } from './post.service';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/createPost.dto';
import { Request } from 'express';
import { UpdatePostDto } from './dto/updatePost.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags("Posts")
@Controller('posts')
export class PostController {
    constructor(private readonly PostService: PostService){}
    @Get("")
    getAll(){
        return this.PostService.getAll();
    }
    @ApiBearerAuth()	
    @UseGuards(AuthGuard("jwt"))
    @Post("create")
    create(@Body() createPostDto : CreatePostDto,@Req() request : Request){
        const userId = request.user["userID"];
        return this.PostService.create(createPostDto,userId);
    }
    @ApiBearerAuth()	
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete/:id")
    delete(@Param("id", ParseIntPipe) postId : number , @Req() request: Request){
        const userId = request.user["userID"];
        return this.PostService.delete(postId,userId);
    }
    @ApiBearerAuth()	
    @UseGuards(AuthGuard("jwt"))
    @Put("update/:id")
    update(@Param("id", ParseIntPipe) postId : number ,@Body() updatePostDto : UpdatePostDto, @Req() request: Request){
        const userId = request.user["userID"];
        return this.PostService.update(postId,updatePostDto,userId);
    }
}
