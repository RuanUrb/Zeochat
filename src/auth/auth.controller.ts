import { Controller, Get, Post, Body, UseGuards, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { Response, Request } from 'express'



@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('/auth/register')
    register(@Body() body: CreateUserDto){
        console.log('hi')
        return this.authService.createUser(body)
    }

    @Post('/auth/signin')
    async signin(@Body() LoginUserDto: LoginUserDto, @Res({passthrough: true}) response: Response){
        const jwt = await this.authService.signin(LoginUserDto)
        response.cookie('access_token', jwt.access_token, {
            httpOnly: true,
            sameSite: 'strict'
        })
        console.log(jwt)
        return jwt
    }

    @Get('/user')
    async getUser(@Req() req: Request){
        try{
            const cookie = req.cookies['access_token']
             const data = await this.authService.verify(cookie)

        if(!data) throw new UnauthorizedException()
        console.log(data)
        return data
        }

        catch(e: any){
            throw new UnauthorizedException()
        }
    }

    @Post('/logout')
    async logout(@Res({passthrough: true}) res: Response){
        res.clearCookie('access_token')
        return {
            message: 'Logged out.'
        }
    }

    @UseGuards(AuthGuard)
    @Get('/chat')
    sayHello(@Req() req: Request){
        console.log(req.user)
        //return 'WELCOME, ' + req.user.name
    }

}


