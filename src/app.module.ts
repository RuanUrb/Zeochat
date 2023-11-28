import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MessagesModule, MongooseModule.forRoot('mongodb://localhost/reochat')
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
