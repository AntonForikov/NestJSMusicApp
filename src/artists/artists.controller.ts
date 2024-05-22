import {Controller, Get, Param, Post} from '@nestjs/common';

@Controller('artists')
export class ArtistsController {
    @Post()
    create() {
        return {message: 'Created artist'};
    };

    @Get()
    getAll() {
        return {message: 'All artists'};
    }

    @Get(':id')
    getById(@Param('id') id: string) {
        return {message: `Artist with id: ${id}`};
    };
}
