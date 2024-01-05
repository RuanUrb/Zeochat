import { User } from "../entities/user.entity";
import * as Joi from "joi";


export class CreateUserDto extends User{}

export const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    avatarUrl: Joi.string().required().uri()
})