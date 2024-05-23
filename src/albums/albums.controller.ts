import {Body, Controller, Delete, Get, Param, Post, Query, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {Album, AlbumDocument} from "../schemas/album.schema";
import {CreateAlbumDto} from "./create-album.dto";
import {Response} from "express";
import {FileInterceptor} from "@nestjs/platform-express";

@Controller('albums')
export class AlbumsController {
    constructor(
        @InjectModel(Album.name)
        private albumModel: Model<AlbumDocument>,
    ) {}
    @Post()
    @UseInterceptors(FileInterceptor('image', {dest: './public/images/albums'}))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() albumDto: CreateAlbumDto
    ) {
        let fileExt: string;
        if (file) fileExt = file.mimetype.split('/')[1];
        const album = new this.albumModel({
            title: albumDto.title,
            year: albumDto.year,
            image: file ? `/images/artists/${file.filename}.${fileExt}` : null,
            artist: albumDto.artist
        })
        return await album.save();
    };

    @Get()
    async getAll(@Query('artistId') artistId: string, @Res() res: Response) {
        if(artistId) {
            const targetAlbums = await this.albumModel.find({artist: artistId});
            if (targetAlbums.length === 0) return res.status(404).send({error: 'Album with such artist is not found'});
            return res.send(targetAlbums);
        }
        const albums = await this.albumModel.find();
        return res.send(albums);
    };

    @Get(':id')
    async getAlbumById (@Param('id') id: string, @Res() res: Response) {
        const targetAlbum = await this.albumModel.findOne({_id: id}).populate('artist');
        if (!targetAlbum) return res.status(404).send({error: 'Album not found.'});
        return res.send(targetAlbum);
    };

    @Delete(':id')
    async deleteAlbum(@Param('id') id: string, @Res() res: Response) {
        const albumToDelete = await this.albumModel.findOne({_id: id});
        console.log(albumToDelete)
        if (!albumToDelete) return res.status(404).send({error: 'Album not found'});
        await this.albumModel.deleteOne({_id: id});
        return res.send('Album deleted');
    };
}
