import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
  Query,
} from '@nestjs/common';
import { ClientService } from './client.service';
import { Client } from 'src/entities/client.entity';
import { CreateClientDto } from 'src/client/createClient.dto';
import { UpdateClientDto } from 'src/client/updateClient.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProformaService } from 'src/proforma/proforma.service';

@Controller('clients')
export class ClientController {
  constructor(
    private readonly clientService: ClientService,
    private readonly proformaService: ProformaService,
  ) { }

  @Get('client-count')
  async getClientCount(): Promise<number> {
    return this.clientService.getClientCount();
  }

  @Get()
  async findAll(@Query('email') email?: string): Promise<Client[]> {
    return this.clientService.findAll(email);
  }
  /**ajoutt */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.clientService.findOne(id); // Utilisez le service pour récupérer le client
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateClientDto,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<Client | null> {
    try {
      const logo: string | undefined = file
        ? `http://localhost:3000/uploads/${file.filename}`
        : undefined;
      const updateClient = await this.clientService.update(id, dto, logo);
      return updateClient;
    } catch (error) {
      console.error('Error during filr upload or update:', error);
      throw new InternalServerErrorException('Internal server error');
    }
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('logo', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async create(
    @Body() dto: CreateClientDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Client> {
    const logo: string | undefined = file
      ? `http://localhost:3000/uploads/${file.filename}`
      : undefined;
    return this.clientService.create(dto, logo);
  }

  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    const deleted = await this.clientService.remove(id);
    if (!deleted) {
      throw new NotFoundException(`Client avec ID ${id} introuvable`);
    }
    return { message: 'Client supprimé avec succès' };
  }

  @Get(':clientId/proforma-items')
  async getClientProformaItems(
    @Param('clientId', ParseIntPipe) clientId: number,
  ) {
    console.log(
      `Backend: Requête reçue pour les items de proforma du client ID: ${clientId}`,
    );
    try {
      const items =
        await this.proformaService.getProformaItemsByClientId(clientId);
      console.log(
        `Backend: ${items.length} items de proforma trouvés pour le client ID: ${clientId}`,
      );
      return items;
    } catch (error) {
      console.error(
        `Backend: Erreur lors de la récupération des items de proforma pour le client ${clientId}:`,
        error,
      );

      throw new InternalServerErrorException(
        'Erreur lors du chargement des items de proforma.',
      );
    }
  }
}
