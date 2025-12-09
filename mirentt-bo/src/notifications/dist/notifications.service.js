"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.NotificationsService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var notifications_entity_1 = require("../entities/notifications.entity");
var NotificationsService = /** @class */ (function () {
    function NotificationsService(notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    /**
     * Crée une nouvelle notification dans la base de données.
     * @param createNotificationDto Les données pour créer la notification.
     * @returns La notification nouvellement créée.
     */
    NotificationsService.prototype.createNotification = function (createNotificationDto) {
        return __awaiter(this, void 0, Promise, function () {
            var notification;
            return __generator(this, function (_a) {
                notification = this.notificationsRepository.create(createNotificationDto);
                return [2 /*return*/, this.notificationsRepository.save(notification)];
            });
        });
    };
    /**
     * Récupère toutes les notifications, triées par date de création décroissante.
     * Ceci correspond au GET /notifications de votre contrôleur.
     * @returns Une liste de toutes les notifications.
     */
    NotificationsService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notificationsRepository.find({
                        order: { createdAt: 'DESC' }
                    })];
            });
        });
    };
    /**
     * Récupère uniquement les notifications non lues, triées par date de création décroissante.
     * Ceci correspond au GET /notifications/unread de votre contrôleur.
     * @returns Une liste de notifications non lues.
     */
    NotificationsService.prototype.findUnreadNotifications = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.notificationsRepository.find({
                        where: { isRead: false },
                        order: { createdAt: 'DESC' }
                    })];
            });
        });
    };
    /**
     * Marque une notification spécifique comme lue.
     * Vérifie d'abord si la notification existe avant de la mettre à jour.
     * Ceci correspond au PATCH /notifications/:id/read de votre contrôleur.
     * @param id L'ID de la notification à marquer comme lue.
     * @throws NotFoundException Si la notification n'est pas trouvée.
     */
    NotificationsService.prototype.markAsRead = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var notification;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.notificationsRepository.findOne({
                            where: { id: id }
                        })];
                    case 1:
                        notification = _a.sent();
                        if (!notification) {
                            throw new common_1.NotFoundException("Notification avec l'ID " + id + " non trouv\u00E9e.");
                        }
                        notification.isRead = true; // Mettre à jour la propriété isRead
                        return [4 /*yield*/, this.notificationsRepository.save(notification)];
                    case 2:
                        _a.sent(); // Sauvegarder les modifications
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Marque toutes les notifications non lues comme lues.
     * Ceci correspond au PATCH /notifications/mark-all-read de votre contrôleur.
     * @returns Aucune donnée.
     */
    NotificationsService.prototype.markAllAsRead = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Mettre à jour toutes les notifications qui ne sont pas lues
                    return [4 /*yield*/, this.notificationsRepository.update({ isRead: false }, { isRead: true })];
                    case 1:
                        // Mettre à jour toutes les notifications qui ne sont pas lues
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NotificationsService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(notifications_entity_1.Notification))
    ], NotificationsService);
    return NotificationsService;
}());
exports.NotificationsService = NotificationsService;
