import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import mongoose, {Document, Types} from "mongoose";
import {Album} from "./album.schema";

@Schema()
export class Track{
    @Prop({required: true})
    title: string;

    @Prop({
        ref: Album.name,
        required: true,
        validate: {
            validator: async function (id: Types.ObjectId)  {
                const artist = await this.model('Album').findById(id);
                return Boolean(artist);
            },
            message: 'Album does not exist!!!!'
        }
    })
    album: mongoose.Schema.Types.ObjectId

    @Prop({required: true})
    duration: string;

    @Prop({required: true})
    indexNumber: number;

    @Prop({required: true, default: false})
    isPublished: boolean;
}

export type TrackDocument = Track & Document;
export const TrackSchema = SchemaFactory.createForClass(Track);