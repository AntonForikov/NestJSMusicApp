import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors
} from '@nestjs/common';
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
import {TokenAuthGuard} from "../auth/token-auth.guard";

@Controller('artists')
export class ArtistsController {
    constructor(
        @InjectModel(Artist.name)
        private artistModel: Model<ArtistDocument>
    ) {
    };

    @UseGuards(TokenAuthGuard)
    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: async (_req, file, cb) => {
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
        @Body() artistDto: CreateArtistDto,
        @Res() res: Response
    ) {
        try {
            const artist = new this.artistModel({
                name: artistDto.name,
                information: artistDto.information,
                image: file && file.filename !== null ? `/images/artists/${file.filename}` : null,
            });
            await artist.save();
            return res.send(artist);
        } catch (e) {
            unlink(`./public/images/artists/${file.filename}`, (e) => {
                if (e) return console.log('File does not exist');
                console.log('File deleted');
            });
            return res.status(400).send(e)
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
