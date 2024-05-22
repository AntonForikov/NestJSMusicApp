import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {Model} from "mongoose";
import {CreateArtistDto} from "./create-artist.dto";

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
    async getById(@Param('id') id: string) {
        return await this.artistModel.findById({_id: id});
    };
}
