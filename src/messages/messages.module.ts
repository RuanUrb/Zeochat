import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/schemas/message.schema';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/entities/schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';

@Module({
  providers: [MessagesGateway, MessagesService, AuthService],
  imports: [MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}]), AuthModule, MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '24h'}
  })
]
})
export class MessagesModule {}
