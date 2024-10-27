import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import RegisterDto from './dto/Register.dto';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @UseGuards(LocalStrategy)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user);
    }
        
    @Post('register')
    register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @UseGuards(JwtAuthGuard)
    @Get('check')
    async checl(@Request() req: any) {
        return this.authService.checkUser(req)
    }
}
