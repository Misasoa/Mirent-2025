import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { TypeService } from './type.service';
import { Type } from 'src/entities/type.entity';

@Controller('type')
export class TypeController {
  constructor(private readonly typesService: TypeService) { }

  @Get()
  async findAll(): Promise<Type[]> {
    return this.typesService.findAll();
  }

  @Post()
  async createType(@Body() typeData: { type: string }): Promise<Type> {
    return this.typesService.create(typeData.type);
  }
  @Delete(':id')
  async deleteType(@Param('id') id: number): Promise<void> {
    return this.typesService.delete(id);
  }

  @Put(':id')
  async updateType(@Param('id') id: number, @Body() type: Type): Promise<Type> {
    return this.typesService.update(id, type);
  }
}
