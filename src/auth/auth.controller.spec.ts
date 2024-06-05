import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthServiceMock } from './mocks/Auth.service.mock';
import { userMock } from './mocks/user.mock';
import { MailerService } from '../mailer/mailer.service';
import { MailerServiceMock } from './mocks/Mailer.service.mock';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaServiceMock } from './mocks/prisma.service.mock';
import { use } from 'passport';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{provide : AuthService, useClass: AuthServiceMock},
        {provide : MailerService, useValue: MailerServiceMock},
      ],
    }).compile();

    authController = app.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });


  describe('signup',() => {
    it('should return {"data": "User successfully created"}', () =>{
      expect(authController.signup(userMock[0])).resolves.toEqual({"data" : "User successfully created"});
  });
   
  })

});