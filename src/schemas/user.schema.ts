import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR = 10;
@Schema()
export class User {
    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop({required: true})
    token: string;

    @Prop()
    displayName: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function () {
    this.token = crypto.randomUUID();
};

UserSchema.methods.checkPassword = function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function () {
    if (this.isModified('password')) return;

    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
    transform: (_, ret) => {
        delete ret.password;
        return ret;
    }
});