
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
import { jwtConstants } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService: JwtService){}

    async canActivate(context: ExecutionContext){
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if(!token) throw new UnauthorizedException('You need to signin to do this.')
        try{
            const payload = await this.jwtService.verifyAsync(token, {secret: jwtConstants.secret})
            request['user'] = payload // assigns payload to the request object to be accessed in the routers
        }
        catch{
            throw new UnauthorizedException('User could not be authenticated.')
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}