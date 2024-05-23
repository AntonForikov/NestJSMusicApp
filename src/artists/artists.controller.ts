import {Body, Controller, Delete, Get, Param, Post, Res, UploadedFile, UseInterceptors} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Artist, ArtistDocument} from "../schemas/artist.schema";
import {Model} from "mongoose";
import {CreateArtistDto} from "./create-artist.dto";
import {Response} from "express";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import {extname} from 'path';
import {promises as fs} from 'fs';
import {unlink} from "node:fs";

@Controller('artists')
export class ArtistsController {
    constructor(
        @InjectModel(Artist.name)
        private artistModel: Model<ArtistDocument>
    ) {
    };

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: async (_req, _file, cb) => {
                    const destDir = './public/images/artists';
                    await fs.mkdir(destDir, {recursive: true});
                    cb(null, './public/images/artists');
                },
                filename: (_,file, cb) => {
                    const ext = extname(file.originalname);
                    const filename = `${crypto.randomUUID()}${ext}`;
                    cb(null, filename);
                }
            })
        }))
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() artistDto: CreateArtistDto
    ) {
        try {
            const artist = new this.artistModel({
                name: artistDto.name,
                information: artistDto.information,
                image: file ? `/images/artists/${file.filename}` : null,
            });
            return await artist.save();
        } catch {
            unlink(`./public/images/artists/${file.filename}`, (e) => {
                if (e) return console.log('File does not exist');
                console.log('File deleted');
            });
        }
    };

    @Get()
    async getAll() {
        return await this.artistModel.find();
    };

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
    };
}
