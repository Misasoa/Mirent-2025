import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
  StreamableFile,
  ValidationPipe,
} from '@nestjs/common';

import { Response } from 'express';
import { ProformaService } from './proforma.service';
import { Proforma } from 'src/entities/proforma.entity';
import { CreateProformaByCriteriaDto } from './create-proforma.dto';
import { FindAvailableVehiclesDto } from 'src/dto/find-available-vehicles.dto';
import { UpdateProformaStatusDto } from 'src/dto/update-proforma-status.dto';
import { UpdateProformaItemDto } from './uptade-proforma.dto';
import { CreateProformaItemByCriteriaDto } from './create-proformaItem.dto';

@Controller('proforma')
export class ProformaController {
  constructor(private readonly proformaService: ProformaService) {}

  @Post()
  async createByCriteria(
    @Body(new ValidationPipe())
    createProformaByCriteriaDto: CreateProformaByCriteriaDto,
    @Res() res: Response, // Injectez l'objet Response
  ) {
    try {
      const { proforma, pdfBuffer, message } =
        await this.proformaService.create(createProformaByCriteriaDto);
      const pdfBase64 = pdfBuffer.toString('base64');

      res.status(201).json({ ...proforma, pdfBase64, message }); // Incluez pdfBase64 dans la réponse
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Get('available-vehicles')
  async findAvailableVehicles(
    @Query(new ValidationPipe()) query: FindAvailableVehiclesDto,
  ) {
    return this.proformaService.findAvailableVehicles(query);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.proformaService.findOne(id);
  }

  @Get()
  async findAll(): Promise<Proforma[]> {
    return this.proformaService.findAll();
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: number,
    @Body(new ValidationPipe())
    updateProformaStatusDto: UpdateProformaStatusDto,
  ) {
    return this.proformaService.updateStatus(
      id,
      updateProformaStatusDto.status,
    );
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.proformaService.delete(id);
  }

  // proforma.controller.ts

  @Put(':id') // C'est la SEULE route PUT avec ce chemin
  @HttpCode(HttpStatus.OK)
  async updateProformaItem(
    // Renommez la méthode pour clarifier ce qu'elle fait
    @Param('id') id: string, // L'ID vient de l'URL, c'est une string
    @Body() updateProformaItemDto: UpdateProformaItemDto, // Le corps de la requête est le DTO de l'item
  ) {
    console.log(`Tentative de mise à jour de l'item de proforma ID: ${id}`);
    console.log('DTO reçu:', updateProformaItemDto);

    // Appelle la méthode 'update' de ProformaItemService
    // Convertit l'ID de string en number car le service l'attend comme number
    const updatedItem = await this.proformaService.update(
      Number(id), // Conversion ici
      updateProformaItemDto,
    );
    console.log('Item de proforma mis à jour:', updatedItem);
    return updatedItem;
  }

  @Get(':id/pdf')
  async getProformaPdf(
    @Param('id') id: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log(
      `[Controller] getProformaPdf : Récupération du PDF pour l'ID : ${id}`,
    );
    return this.proformaService.getProformaPdf(+id, res);
  }
}
