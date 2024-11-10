import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

/*
    This guard is used to protect routes that only admin users should be able to access.
    It is used in the challenge controller to protect the getAllChallenges route.
    If the user is not an admin, the guard will return false and the user will not be able to access the route.
*/

// example @UseGuards(JwtAuthGuard, AdminOnlyGuard)

@Injectable()
export class AdminOnlyGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        if(!request.user) {
            throw new Error("jwtAuthGuard is required to user this")
        }
        const user = request.user;
        if(user.role !== "ADMIN") {
            return false;
        }

        return true;
    }
}