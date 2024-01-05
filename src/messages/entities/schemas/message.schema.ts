import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/auth/entities/schemas/user.schema";

export type MessageDocument = HydratedDocument<Message>

@Schema()
export class Message{
    @Prop()
    name: string
    
    @Prop()
    text: string

    @Prop({type: Date})
    date: Date

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User
}

export const MessageSchema = SchemaFactory.createForClass(Message)