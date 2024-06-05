import {IsNotEmpty, IsEmail} from "class-validator"
export class signinDto {
    @IsEmail()
    readonly email : string
    
    @IsNotEmpty()
    readonly password : string
}