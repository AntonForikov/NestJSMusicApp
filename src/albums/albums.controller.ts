import {Body, Controller, Get, Post} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {CreateAlbumDto} from "./create-album.dto";

@Controller('albums')
export class AlbumsController {
    constructor(
        @InjectModel(Album.name)
        private albumModel: Model<AlbumDocument>,
    ) {}
    @Post()
    async create(@Body() albumDto: CreateAlbumDto) {
        const album = new this.albumModel({
            title: albumDto.title,
            year: albumDto.year,
            image: albumDto.image,
            artist: albumDto.artist
        })
        return await album.save();
    }

    @Get()
    async getAll() {
        return await this.albumModel.find();
    }
}
