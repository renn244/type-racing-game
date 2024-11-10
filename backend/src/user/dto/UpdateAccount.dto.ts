import { PartialType } from "@nestjs/mapped-types";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateAccount {
    @IsString()
    username: string;
    
    @IsString()
    email: string;
}

export class UpdateUserInfo {
    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    location?: string;
    
    @IsArray()
    socialMedias: string[]
}

export class UpdatePassword {
    @MinLength(6)
    @MaxLength(30)
    @IsString()
    password: string;

    @MinLength(6)
    @MaxLength(30)
    @IsString()
    newPassword: string;

    @MinLength(6)
    @MaxLength(30)
    @IsString()
    confirmPassword: string;
}

class TypePreferences {
    @IsBoolean()
    soundEffects: boolean;
    
    @IsNumber()
    fontSize: number;
    
    @IsString()
    keyboardLayout: string;
}

export class UpdateTypePreferences extends PartialType(TypePreferences) {}

export class UpdateNotification {

}

export class UpdatePrivacy {
    privateProfile: boolean;
    showStats: boolean;
}

export class Update2FA {
    @IsBoolean()
    multiFA: boolean;
}