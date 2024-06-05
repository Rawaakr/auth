import { AuthService } from './auth.service';
import { Body,Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { signupDto } from './dto/signup.dto';
import { signinDto } from './dto/signin.dto';
import { resetPasswordDto } from './dto/resetpassword.dto';
import { resetPasswordConfirmationDto } from './dto/resetpasswordconfirmation.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private readonly AuthService : AuthService){}
    @Post("signup")
    signup(@Body() signupDto : signupDto) {
        return this.AuthService.signup(signupDto)
    }
    @Post("signin")
    signin(@Body() signinDto : signinDto) {
        return this.AuthService.signin(signinDto)
    }
    @Post("reset-password")
    resetPasswordDemand(@Body() resetpasswordDto: resetPasswordDto){
        return this.AuthService.resetPassworDemand(resetpasswordDto)
    }
    @Post("reset-password-confirmation")
    resetPasswordConfirmation(@Body() resetpasswordconfirmationDto: resetPasswordConfirmationDto){
        return this.AuthService.resetPasswordConfirmation(resetpasswordconfirmationDto)
    }
    @ApiBearerAuth()	
    @UseGuards(AuthGuard("jwt"))
    @Delete("delete-account")
    DeleteAccount(@Req() request : Request,@Body() deleteAccountDto : DeleteAccountDto){
    const userId = request.user["userID"]
    return this.AuthService.deleteAccount(userId,deleteAccountDto)
    }
}
