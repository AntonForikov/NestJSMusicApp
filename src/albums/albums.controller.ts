import {Body, Controller, Delete, Get, Param, Post, Res} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {CreateAlbumDto} from "./create-album.dto";
import {Response} from "express";

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

    @Get(':id')
    async getAlbumById (@Param('id') id: string, @Res() res: Response) {
        const targetAlbum = await this.albumModel.findOne({_id: id});
        if (!targetAlbum) return res.status(404).send({error: 'Album not found.'});
        return res.send(targetAlbum);
    }

    @Delete(':id')
    async deleteAlbum(@Param('id') id: string, @Res() res: Response) {
        const albumToDelete = await this.albumModel.findOne({_id: id});
        console.log(albumToDelete)
        if (!albumToDelete) return res.status(404).send({error: 'Album not found'});
        await this.albumModel.deleteOne({_id: id});
        return res.send('Album deleted');
    }
}
