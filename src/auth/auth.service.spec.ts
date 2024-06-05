import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.service.mock';
import { userMock } from './mocks/user.mock';
import { MailerService } from '../mailer/mailer.service';
import { MailerServiceMock } from './mocks/Mailer.service.mock';
import { JwtServiceMock } from './mocks/JwtService.mock';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceMock } from './mocks/ConfigService.mock';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {provide : MailerService, useValue: MailerServiceMock},
        {provide : PrismaService, useValue: PrismaServiceMock},
        {provide: JwtService, useClass : JwtServiceMock},
        {provide : ConfigService,useClass: ConfigServiceMock}
      ],
    }).compile();
    jest.clearAllMocks();
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signup',() =>{

    it('should return {"data" : "User successfully created"}',()=>{
        jest.spyOn(PrismaServiceMock.user,'findUnique').mockResolvedValue(null);
        MailerServiceMock.sendSignupConfirmation.mockResolvedValue(true);
        expect(authService.signup(userMock[0])).resolves.toEqual({"data" : "User successfully created"});
    });
    it('should return a Conflict Exception}',()=>{
        jest.spyOn(PrismaServiceMock.user,'findUnique').mockResolvedValue(userMock[0]);
        expect(authService.signup(userMock[0])).rejects.toBeInstanceOf(ConflictException)
        expect(authService.signup(userMock[0])).rejects.toEqual(new ConflictException({"message" : "User already exists"}))
    })
  })
});