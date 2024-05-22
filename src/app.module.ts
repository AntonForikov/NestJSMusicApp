import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistsController } from './artists/artists.controller';
import {MongooseModule} from "@nestjs/mongoose";
import {Artist, ArtistSchema} from "./schemas/artist.schema";
import { AlbumsController } from './albums/albums.controller';
import { TracksController } from './tracks/tracks.controller';

@Module({
  imports: [
      MongooseModule.forRoot('mongodb://localhost/music'),
      MongooseModule.forFeature([
        {name: Artist.name, schema: ArtistSchema}
      ])
  ],
  controllers: [AppController, ArtistsController, AlbumsController, TracksController],
  providers: [AppService],
})
export class AppModule {}
