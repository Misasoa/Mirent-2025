import {
  Controller,
  Get,
  Patch,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { Notification } from '../entities/notifications.entity'; // Assurez-vous d'importer l'entité Notification

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Récupère TOUTES les notifications.
   * C'est l'endpoint que votre frontend appelle initialement.
   * @returns Une liste de toutes les notifications.
   */
  @Get() // <-- NOUVELLE ROUTE : Gère les requêtes GET à /notifications
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Notification[]> {
    return this.notificationsService.findAll();
  }

  /**
   * Récupère uniquement les notifications non lues.
   * Peut être utile pour un affichage spécifique ou une fonctionnalité de "badge".
   * @returns Une liste de notifications non lues.
   */
  @Get('unread')
  @HttpCode(HttpStatus.OK)
  async getUnread(): Promise<Notification[]> {
    return this.notificationsService.findUnreadNotifications();
  }

  /**
   * Marque une notification spécifique comme lue.
   * @param id L'ID de la notification à marquer comme lue.
   */
  @Patch(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT) // Retourne 204 No Content pour un succès sans données à retourner
  async markAsRead(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.notificationsService.markAsRead(id);
  }

  /**
   * Marque toutes les notifications non lues comme lues.
   * @returns Aucune donnée.
   */
  @Patch('mark-all-read') // <-- NOUVELLE ROUTE : Gère les requêtes PATCH à /notifications/mark-all-read
  @HttpCode(HttpStatus.NO_CONTENT) // Retourne 204 No Content
  async markAllAsRead(): Promise<void> {
    await this.notificationsService.markAllAsRead();
  }
}
