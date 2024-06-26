import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, Types} from "mongoose";
import {Artist} from "./artist.schema";

@Schema()
export class Album{
    @Prop({required: true})
    title: string;

    @Prop({
        ref: Artist.name,
        required: true,
        validate: {
            validator: async function (id: Types.ObjectId)  {
                const artist = await this.model('Artist').findById(id);
                return Boolean(artist);
            },
            message: 'Artist does not exist!!!!'
        }
    })
    artist: mongoose.Schema.Types.ObjectId ;

    @Prop({required: true})
    year: number;

    @Prop({default: null})
    image: string | null;

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export type AlbumDocument = Album & Document;
export const AlbumSchema = SchemaFactory.createForClass(Album);