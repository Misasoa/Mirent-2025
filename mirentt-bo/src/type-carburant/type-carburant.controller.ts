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
import { TypeCarburantService } from './type-carburant.service';
import { CreateTypeCarburantDto } from './dto/create-type-carburant.dto';

@Controller('type-carburant')
export class TypeCarburantController {
  constructor(private readonly typeCarburantService: TypeCarburantService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createTypeDto: CreateTypeCarburantDto) {
    return this.typeCarburantService.create(createTypeDto);
  }

  @Get()
  findAll() {
    return this.typeCarburantService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.typeCarburantService.findOne(id);
  }
}
