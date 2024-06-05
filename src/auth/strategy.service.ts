import { DeleteAccountDto } from './dto/deleteAccount.dto';
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

type Payload = {
    sub : number,
    email:string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(   configservice: ConfigService,private readonly prismaService : PrismaService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configservice.get("SECRET_KEY"),
            ignoreExpiration  : false
        })
    }

    async validate(payload : Payload) {
        const user = await this.prismaService.user.findUnique({where:{email : payload.email}});
        if (!user ) throw new UnauthorizedException("Unauthorizedddd");
        Reflect.deleteProperty(user,"password");
        console.log(user);
        return user;
    }

    
}