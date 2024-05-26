import {Body, Controller, Delete, Post, Req, Res, UseGuards} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";
import {CreateUserDto} from "./create-user.dto";
import {Request, Response} from "express";
import {AuthGuard} from "@nestjs/passport";

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
    };

    @UseGuards(AuthGuard('local'))
    @Post('sessions')
    async login(@Req() req: Request){
        return req.user;
    };

    @Delete('sessions')
    async logout(@Req() req: Request, @Res() res: Response) {
        const tokenData = req.get('Authorization');
        const successMessage = {message: 'Successfully logout'};

        if (!tokenData) return res.status(401).send({error: 'No token provided'});

        const [_, token] = tokenData.split(' ');
        const user = await this.userModel.findOne({token});

        if (!user) return res.send(successMessage);

        user.generateToken();
        await user.save();

        return res.send(successMessage);
    }
}
