import {Body, Controller, Post} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";
import {CreateUserDto} from "./create-user.dto";

@Controller('users')
export class UsersController {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {}

    @Post()
    registerUser(@Body() createUserDto: CreateUserDto) {
        const user = new this.userModel({
            email: createUserDto.email,
            password: createUserDto.password,
            displayName: createUserDto.displayName ? createUserDto.displayName : null
        });

        user.generateToken();
        return user.save();
    }
}
