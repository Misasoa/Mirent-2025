import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { DevisService } from './devis.service';
import { CreateDevisDto } from './dto/create-devis.dto';
import { UpdateDevisDto } from './dto/update-devis.dto';

@Controller('devis') // Route de base pour cette API
export class DevisController {
  constructor(private readonly devisService: DevisService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Retourne un statut 201 Created
  create(@Body() createDevisDto: CreateDevisDto) {
    return this.devisService.create(createDevisDto);
  }

  @Get()
  findAll() {
    return this.devisService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.devisService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDevisDto: UpdateDevisDto) {
    return this.devisService.update(id, updateDevisDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Retourne un statut 204 No Content pour une suppression réussie
  remove(@Param('id') id: string) {
    return this.devisService.remove(id);
  }
}
