import { Controller, Get, Post, Body, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';



@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('/auth/register')
    register(@Body() body: CreateUserDto){
        console.log('hi')
        return this.authService.createUser(body)
    }

    @Post('/auth/signin')
    signin(@Body() LoginUserDto: LoginUserDto){
        return this.authService.signin(LoginUserDto)
    }

    @UseGuards(AuthGuard)
    @Get('/chat')
    sayHello(@Request() req){
        console.log(req.user)
        return 'WELCOME, ' + req.user.name
    }

}


