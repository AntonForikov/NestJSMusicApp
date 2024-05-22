import {Body, Controller} from '@nestjs/common';
import {InjectModel, Prop} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Track, TrackDocument} from "../schemas/tracks.schema";
import {CreateTrackDto} from "./create-track.dto";

@Controller('tracks')
export class TracksController {
    constructor(
        @InjectModel(Track.name)
        private trackModel: Model<TrackDocument>
    ) {
    }
    @Prop()
    async createTrack(
        @Body() trackDto: CreateTrackDto
    ) {

        const track = new this.trackModel({
            title: trackDto.title,
            duration: trackDto.duration,
            indexNumber: trackDto.indexNumber,
            album: trackDto.album
        })
        return await track.save();
    };

}
