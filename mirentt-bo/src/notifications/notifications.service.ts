import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notifications.entity';
import { CreateNotificationDto } from './create_notifications.dto'; // Assurez-vous d'avoir ce DTO

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
  ) { }

  /**
   * Crée une nouvelle notification dans la base de données.
   * @param createNotificationDto Les données pour créer la notification.
   * @returns La notification nouvellement créée.
   */
  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create(
      createNotificationDto,
    );
    return this.notificationsRepository.save(notification);
  }

  /**
   * Récupère toutes les notifications, triées par date de création décroissante.
   * Ceci correspond au GET /notifications de votre contrôleur.
   * @returns Une liste de toutes les notifications.
   */
  async findAll(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      order: { createdAt: 'DESC' }, // Trier par la date de création la plus récente en premier
    });
  }

  /**
   * Récupère uniquement les notifications non lues, triées par date de création décroissante.
   * Ceci correspond au GET /notifications/unread de votre contrôleur.
   * @returns Une liste de notifications non lues.
   */
  async findUnreadNotifications(): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Marque une notification spécifique comme lue.
   * Vérifie d'abord si la notification existe avant de la mettre à jour.
   * Ceci correspond au PATCH /notifications/:id/read de votre contrôleur.
   * @param id L'ID de la notification à marquer comme lue.
   * @throws NotFoundException Si la notification n'est pas trouvée.
   */
  async markAsRead(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée.`);
    }
    notification.isRead = true; // Mettre à jour la propriété isRead
    await this.notificationsRepository.save(notification); // Sauvegarder les modifications
  }

  /**
   * Marque toutes les notifications non lues comme lues.
   * Ceci correspond au PATCH /notifications/mark-all-read de votre contrôleur.
   * @returns Aucune donnée.
   */
  async markAllAsRead(): Promise<void> {
    // Mettre à jour toutes les notifications qui ne sont pas lues
    await this.notificationsRepository.update(
      { isRead: false },
      { isRead: true },
    );
    // Alternativement, si vous avez besoin de charger les entités pour des hooks TypeORM ou des validations
    // const unreadNotifications = await this.notificationsRepository.find({ where: { isRead: false } });
    // if (unreadNotifications.length > 0) {
    //   unreadNotifications.forEach(notif => (notif.isRead = true));
    //   await this.notificationsRepository.save(unreadNotifications);
    // }
  }
  /**
   * Supprime une notification spécifique.
   * Ceci correspond au DELETE /notifications/:id de votre contrôleur.
   * @param id L'ID de la notification à supprimer.
   * @throws NotFoundException Si la notification n'est pas trouvée.
   */
  async delete(id: number): Promise<void> {
    const notification = await this.notificationsRepository.findOne({
      where: { id },
    });
    if (!notification) {
      throw new NotFoundException(`Notification avec l'ID ${id} non trouvée.`);
    }
    await this.notificationsRepository.remove(notification);
  }
}
