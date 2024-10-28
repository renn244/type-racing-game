import { IsString, IsEmail } from 'class-validator';


export default class RegisterDto {
    @IsString()
    username: string;

    @IsEmail()
    email: string;

    @IsString()
    password: string;

    @IsString()
    confirmPassword: string;
}