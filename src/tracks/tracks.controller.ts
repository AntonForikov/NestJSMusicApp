import {Body, Controller, Delete, Get, Param, Post, Query, Req, Res, UseGuards} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Track, TrackDocument} from "../schemas/tracks.schema";
import {CreateTrackDto} from "./create-track.dto";
import {Request, Response} from "express";
import {TokenAuthGuard} from "../auth/token-auth.guard";
import {RoleAuthGuard} from "../auth/role-auth.guard";

@Controller('tracks')
export class TracksController {
    constructor(
        @InjectModel(Track.name)
        private trackModel: Model<TrackDocument>
    ) {
    }

    @UseGuards(TokenAuthGuard)
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

    @UseGuards(RoleAuthGuard)
    @Delete(':id')
    async deleteTrack(@Param('id') id: string, @Res() res: Response, @Req() req: Request) {
        const trackToDelete = await this.trackModel.findOne({_id: id});
        if (!trackToDelete) return res.status(404).send({error: 'Track not found'});
        await this.trackModel.deleteOne({_id: id});
        return res.send('Track deleted');
    };
}
