import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { Vehicule } from 'src/entities/vehicle.entity';
import { CreateVehiculeDto } from './createVehicule.dto';
import { UpdateVehiculeDto } from './updateVehicule.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(
    private readonly vehiclesService: VehiclesService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  // --- Récupérer tous les véhicules ---
  @Get()
  findAll(): Promise<Vehicule[]> {
    return this.vehiclesService.findAll();
  }

  // --- Créer un véhicule ---
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        const allowedMimetypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedMimetypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Type de fichier invalide. Formats acceptés: JPG, PNG, WEBP'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async create(
    @Body() dto: CreateVehiculeDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Vehicule> {
    let imageUrl: string | undefined;
    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
        console.log('Image uploadée sur Cloudinary:', imageUrl);
      } catch (error) {
        console.error('Erreur upload Cloudinary:', error);
        // Continue sans image si l'upload échoue
      }
    }
    return this.vehiclesService.create(dto, imageUrl);
  }

  // --- Mettre à jour un véhicule ---
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    FileInterceptor('image', {
      storage: memoryStorage(),
      fileFilter: (req, file, callback) => {
        const allowedMimetypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedMimetypes.includes(file.mimetype)) {
          return callback(new BadRequestException('Type de fichier invalide. Formats acceptés: JPG, PNG, WEBP'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    }),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateVehiculeDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Vehicule> {
    let imageUrl: string | undefined;
    if (file) {
      try {
        imageUrl = await this.cloudinaryService.uploadImage(file);
        console.log('Image mise à jour sur Cloudinary:', imageUrl);
      } catch (error) {
        console.error('Erreur upload Cloudinary:', error);
        // Continue sans changer l'image si l'upload échoue
      }
    }
    return this.vehiclesService.update(id, dto, imageUrl);
  }

  // --- Supprimer un véhicule ---
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.vehiclesService.remove(id);
    return { message: `Vehicle with ID ${id} deleted successfully` };
  }

  // --- Mettre à jour le statut par ID ---
  @Patch(':id/status')
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('statusId') statusId: number,
  ): Promise<Vehicule> {
    return this.vehiclesService.updateStatus(id, statusId);
  }

  // --- Mettre à jour le statut par nom ---
  @Post(':id/status')
  async updateStatusByName(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') statusName: string,
  ): Promise<Vehicule> {
    return this.vehiclesService.updateStatusByName(id, statusName);
  }

  // --- Compter les véhicules disponibles ---
  @Get('available-count')
  async getAvailableVehiclesCount(): Promise<{ count: number }> {
    const count = await this.vehiclesService.getAvailableVehiculeCount();
    return { count };
  }

  // --- Obtenir le taux d'occupation ---
  @Get('occupancy-rate')
  async getOccupancyRate(): Promise<{ rate: number }> {
    const rate = await this.vehiclesService.getOccupancyRate();
    return { rate };
  }

  // --- Récupérer un véhicule par ID ---
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Vehicule> {
    const vehicle = await this.vehiclesService.findOne(id);
    if (!vehicle) throw new NotFoundException(`Vehicle with ID ${id} not found`);
    return vehicle;
  }
}
