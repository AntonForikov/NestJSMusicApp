import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {Observable} from 'rxjs';
import {InjectModel} from "@nestjs/mongoose";
import {User, UserDocument} from "../schemas/user.schema";
import {Model} from "mongoose";

@Injectable()
export class RoleAuthGuard implements CanActivate {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const headerValue = request.get('Authorization');
        const [_, token] = headerValue.split(' ');
        if (!token) return false;

        const user = await this.userModel.findOne({token});
        if (!user || user.role !== 'admin') return false;

        request.user = user;
        return true;
    }
}
