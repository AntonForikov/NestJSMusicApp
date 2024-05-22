import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Document} from "mongoose";

@Schema()
export class Artist {
    @Prop({required: true, unique: true})
    name: string;

    @Prop({default: null})
    information: string | null;

    @Prop({default: null})
    image: string | null;

    @Prop({default: false})
    isPublished: boolean;
}

export type ArtistDocument = Artist & Document;
export const ArtistSchema = SchemaFactory.createForClass(Artist);