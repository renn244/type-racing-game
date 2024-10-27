import { IsString, IsOptional, IsEmail } from 'class-validator';


export default class RegisterDto {
    @IsString()
    username: string;

    @IsOptional()
    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;
}