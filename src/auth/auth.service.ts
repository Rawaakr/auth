import { IsEmail } from 'class-validator';
import { resetPasswordConfirmationDto } from './dto/resetpasswordconfirmation.dto';
import { resetPasswordDto } from './dto/resetpassword.dto';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '../mailer/mailer.service';
import { PrismaService } from '../prisma/prisma.service';
import { signupDto } from './dto/signup.dto';
import { signinDto } from './dto/signin.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as speakeasy from 'speakeasy';
import { JwtService } from '@nestjs/jwt';
import { DeleteAccountDto } from './dto/deleteAccount.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
    private readonly configservice: ConfigService,
  ) {}

  async getAll() {
    return await this.prismaService.user.findMany();
  }
  async signup(signupDto: signupDto) {
    const { email, password, username } = signupDto;
    // verifier si l'utilisateur est déjà inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user) throw new ConflictException('User already exists');
    // hasher le mot de passe
    const hash = await bcrypt.hash(password, 10);
    // enregistrer l'utilisateur dans la base de données
    await this.prismaService.user.create({
      data: { email, username, password: hash },
    });
    // Ne pas envoyer l'email de confirmation pour l'instant
     //await this.mailerService.sendSignupConfirmation(email);
    // retourner une réponse de succès
    return { data: 'User successfully created' };
  }

  async signin(signinDto: signinDto) {
    const { email, password } = signinDto;

    // verifier si l'utilisateur est deja inscrit
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    // comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('password does not match');
    // retourn un token jwt
    const payload = {
      sub: user.userID,
      email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }
  async resetPassworDemand(resetpasswordDto: resetPasswordDto) {
    const { email } = resetpasswordDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const code = speakeasy.totp({
      secret: this.configservice.get('OTP_CODE'),
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    const url = 'http://localhost:3000/auth/reset-password-confirmation';
    this.mailerService.sendResetPassword(email, url, code);
    return { data: 'Reset password mail has been sent' };
  }
  async resetPasswordConfirmation(
    resetpasswordconfirmationDto: resetPasswordConfirmationDto,
  ) {
    const { email, code, password } = resetpasswordconfirmationDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');
    const match = speakeasy.totp.verify({
      secret: this.configservice.get('OTP_CODE'),
      token: code,
      digits: 5,
      step: 60 * 15,
      encoding: 'base32',
    });
    if (!match) throw new UnauthorizedException('Invalid/Expired token');
    const hash = await bcrypt.hash(password, 10);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hash },
    });
    return { data: 'password updated' };
  }

  async deleteAccount(userId: number, deleteAccountDto: DeleteAccountDto) {
    const { password } = deleteAccountDto;
    const user = await this.prismaService.user.findUnique({
      where: { userID: userId },
    });
    if (!user) throw new NotFoundException('user not found');
    //comparer le mot de passe
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException("Password doen't match");
    await this.prismaService.user.delete({ where: { userID: userId } });
    return { data: 'user successfully deleted' };
  }
}
