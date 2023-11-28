import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities/schemas/message.schema';

@Module({
  providers: [MessagesGateway, MessagesService],
  imports: [MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}])]
})
export class MessagesModule {}
