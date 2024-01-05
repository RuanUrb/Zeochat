import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Message } from './entities/schemas/message.schema';
import { Model } from 'mongoose';
import { User } from 'src/auth/entities/schemas/user.schema';
import { AuthService } from 'src/auth/auth.service';

interface ClientUser{
  name: string,
  avatarUrl: string
}

@Injectable()
export class MessagesService {
  //messages: Message[] = []
  constructor(@InjectModel(Message.name) private readonly messageModel: Model<Message>, private readonly authService: AuthService){}

  async create(text: string, clientUser: ClientUser) {
    const {name, avatarUrl} = clientUser
    const user = await this.authService.findUserByName(name)
    const newMsg = await this.messageModel.create({name, text, date: new Date(), user})
    const populatedMsg = await newMsg.populate({path: 'user', select: 'name avatarUrl'})
    return populatedMsg
  }

  async findAll() {
    const bns = await this.messageModel.find({}).populate({path: 'user', select: 'name avatarUrl'})
    return bns
  }
}
