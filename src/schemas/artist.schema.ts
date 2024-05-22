import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class Artist {
    @Prop({required: true})
    name: string;

    @Prop()
    information: string | null;

    @Prop()
    image: string | null;

    @Prop()
    isPublished: boolean;

    @Prop()
    user: string;
}

export type ArtistDocument = Artist & Document;
export const ArtistSchema = SchemaFactory.createForClass(Artist);