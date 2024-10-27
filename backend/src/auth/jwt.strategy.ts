import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";

const jwtSecret = process.env.JWT_SECRET!

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false, // set this to true if 
            secretOrKey: jwtSecret
        })
    }

    async validate(payload: any) {
        return payload;
    }
}