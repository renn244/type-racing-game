import { IsString, Max, MaxLength, MinLength } from "class-validator";

export class UpdateAccount {
    @IsString()
    username: string;
    
    @IsString()
    email: string;
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