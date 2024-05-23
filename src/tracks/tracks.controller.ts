import {Body, Controller, Delete, Get, Param, Post, Query, Res} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Track, TrackDocument} from "../schemas/tracks.schema";
import {CreateTrackDto} from "./create-track.dto";
import {Response} from "express";

@Controller('tracks')
export class TracksController {
    constructor(
        @InjectModel(Track.name)
        private trackModel: Model<TrackDocument>
    ) {
    }
    @Post()
    async createTrack(@Body() trackDto: CreateTrackDto){
        const track = new this.trackModel({
            title: trackDto.title,
            duration: trackDto.duration,
            indexNumber: trackDto.indexNumber,
            album: trackDto.album
        });
        return await track.save();
    };

    @Get()
    async getAll(@Query('albumId') albumId: string, @Res() res: Response) {
        if(albumId) {
            const targetTracks = await this.trackModel.find({album: albumId});
            if (targetTracks.length === 0) return res.status(404).send({error: 'Track with such album is not found'});
            return res.send(targetTracks);
        }
        const albums = await this.trackModel.find();
        return res.send(albums);
    };

    @Delete(':id')
    async deleteTrack(@Param('id') id: string, @Res() res: Response) {
        const trackToDelete = await this.trackModel.findOne({_id: id}).populate('album');
        if (!trackToDelete) return res.status(404).send({error: 'Track not found'});
        await this.trackModel.deleteOne({_id: id});
        return res.send('Track deleted');
    };
}
