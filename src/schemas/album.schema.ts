import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document} from "mongoose";
import {Artist} from "./artist.schema";

@Schema()
export class Album{
    @Prop({required: true})
    title: string;

    @Prop({ref: typeof Artist, required: true})
    artist: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    year: number;

    @Prop({default: null})
    image: string | null;

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export type AlbumDocument = Album & Document;
export const AlbumSchema = SchemaFactory.createForClass(Album);