import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MessagesModule, MongooseModule.forRoot('mongodb://localhost/reochat'), AuthModule],
  controllers: [],
  providers: [],
})

export class AppModule {}
