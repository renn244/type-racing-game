import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { GoneException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super();
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateLocal(username, password)

        if(!user.user) {
            throw new GoneException({
                name: user.name,
                message: user.message
            })
        }
        
        // checking if the user has multiFA enabled
        if(user.user.multiFA) {
            return {
                user: user.user, 
                multiFA: "2fa"
            }
        }

        return {
            user: user.user
        }

    }
}