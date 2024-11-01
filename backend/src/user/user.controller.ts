import { Body, Controller, Get, Patch, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateAccount, UpdatePassword, UpdatePrivacy, UpdateTypePreferences } from './dto/UpdateAccount.dto';
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

    @Post('updatePassword')
    async updatePassword(@Body() body: UpdatePassword, @Request() req: any) {
        return this.userService.updatePassword(body, req)
    }

    @Post('updateTypePreferences')
    async updateTypePreferences(@Body() body: UpdateTypePreferences, @Request() req: any) {
        return this.userService.updateTypePreferences(body, req)
    }

    @Post('updatePrivacySettings')
    async updatePrivacySettings(@Body() body: UpdatePrivacy, @Request() req: any) {
        return this.userService.updatePrivacySettings(body, req)
    }
}
