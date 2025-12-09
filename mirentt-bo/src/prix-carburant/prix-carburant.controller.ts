import {
  Controller,
  Post,
  Get,
  Param,
  ParseIntPipe,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PrixCarburantService } from './prix-carburant.service';
import { CreatePrixCarburantDto } from './dto/create-prix-carburant.dto';

@Controller('prix-carburant')
export class PrixCarburantController {
  constructor(private readonly prixCarburantService: PrixCarburantService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createPrixDto: CreatePrixCarburantDto) {
    return this.prixCarburantService.create(createPrixDto);
  }

  @Get()
  findAll() {
    return this.prixCarburantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.prixCarburantService.findOne(id);
  }
}
