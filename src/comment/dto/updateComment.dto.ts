import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateCommentDto{
    @IsOptional()
    readonly title : string ;
    @IsOptional()
    readonly body : string ;
    @IsNotEmpty()
    readonly postId : number;
}