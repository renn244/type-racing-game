import { Body, Controller, Get, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateAccount } from './dto/UpdateAccount.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerStrorage } from 'src/util/MulterStorage';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) {}

    @Get('getDashboardInfo')
    async getDashboardInfo(@Request() req: any) {
        return this.userService.getDashboardInformation(req)
    }

    @Get('getUserInformation')
    async getUserInformation(@Request() req: any) {
        return this.userService.getUserInformation(req)
    }

    @Post('updateAccount')
    @UseInterceptors(FileInterceptor('profile', {
        storage: multerStrorage()
    }))
    async updateAccount(@Body() body: UpdateAccount, @UploadedFile() file: Express.Multer.File , @Request() req: any) {
        return this.userService.updateAccount(body, file, req)
    }
}
