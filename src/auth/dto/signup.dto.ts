import { ApiProperty } from "@nestjs/swagger"
import {IsNotEmpty, IsEmail} from "class-validator"
export class signupDto {
    @ApiProperty()	
    @IsNotEmpty()
    readonly username : string 
    @ApiProperty()	
    @IsNotEmpty()
    @IsEmail()
    readonly email : string
    @ApiProperty()	
    @IsNotEmpty()
    readonly password : string
}