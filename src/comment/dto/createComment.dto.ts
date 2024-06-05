import { IsNotEmpty } from "class-validator";

export class CreateCommentDto{
    @IsNotEmpty()
    readonly title : string ;
    @IsNotEmpty()
    readonly body : string ;
    @IsNotEmpty()
    readonly postId : number
}