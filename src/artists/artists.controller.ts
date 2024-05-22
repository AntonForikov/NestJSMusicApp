import {Body, Controller, Delete, Get, Param, Post, Res} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {Model} from "mongoose";
import {CreateArtistDto} from "./create-artist.dto";
import {Response} from "express";

@Controller('artists')
export class ArtistsController {
    constructor(
        @InjectModel(Artist.name)
        private artistModel: Model<ArtistDocument>
    ) {
    }

    @Post()
    async create(@Body() artistDto: CreateArtistDto) {
        const artist = new this.artistModel({
            name: artistDto.name,
            information: artistDto.information,
            image: artistDto.image,
        })
        return await artist.save();
    };

    @Get()
    async getAll() {
        return await this.artistModel.find();
    }

    @Get(':id')
    async getById(@Param('id') id: string, @Res() res: Response) {
        const artist = await this.artistModel.findById({_id: id});
        if (!artist) return res.status(404).send({error: 'Artist not found.'});
        return res.send(artist);
    };

    @Delete(':id')
    async deleteArtist(@Param('id') id: string, @Res() res: Response) {
        const artistToDelete = await this.artistModel.findOne({_id: id});
        if (!artistToDelete) return res.status(404).send({error: 'Artist not found'});
        await this.artistModel.deleteOne({_id: id});
        return res.send('Artist deleted');
    }
}
