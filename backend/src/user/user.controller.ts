import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('getDashboardInfo')
    async getDashboardInfo(@Request() req: any) {
        return this.userService.getDashboardInformation(req)
    }
}
