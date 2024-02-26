import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [MessagesModule, MongooseModule.forRoot('mongodb://localhost:27017/reochat'), AuthModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})

export class AppModule {}
