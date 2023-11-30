import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/schemas/user.schema';
import { PassportModule} from '@nestjs/passport'
import {JwtModule} from '@nestjs/jwt'
import { jwtConstants } from './constants';

@Module({
  providers: [AuthService],
  controllers: [AuthController],
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), PassportModule, 
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '24h'}
  })]
})
export class AuthModule {}
