import { IsEmail} from "class-validator"
export class resetPasswordDto {
    @IsEmail()
    readonly email : string

}