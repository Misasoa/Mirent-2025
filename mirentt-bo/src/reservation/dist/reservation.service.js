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
exports.ReservationService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var reservation_entity_1 = require("../entities/reservation.entity");
var client_entity_1 = require("../entities/client.entity");
var vehicle_entity_1 = require("../entities/vehicle.entity");
var region_entity_1 = require("../entities/region.entity");
var status_entity_1 = require("../entities/status.entity");
var commande_entity_1 = require("src/entities/commande.entity");
var carburant_price_entity_1 = require("src/entities/carburant-price.entity");
// 🔹 Fonction utilitaire pour convertir un nombre en lettres (français simplifié)
function numberToFrenchWords(n) {
    var units = [
        '',
        'un',
        'deux',
        'trois',
        'quatre',
        'cinq',
        'six',
        'sept',
        'huit',
        'neuf',
        'dix',
        'onze',
        'douze',
        'treize',
        'quatorze',
        'quinze',
        'seize',
        'dix-sept',
        'dix-huit',
        'dix-neuf',
    ];
    var tens = [
        '',
        'dix',
        'vingt',
        'trente',
        'quarante',
        'cinquante',
        'soixante',
        'soixante',
        'quatre-vingt',
        'quatre-vingt',
    ];
    if (n === 0)
        return 'zéro Ariary';
    function convertBelow1000(num) {
        var result = '';
        var hundreds = Math.floor(num / 100);
        var remainder = num % 100;
        if (hundreds > 0) {
            if (hundreds > 1)
                result += units[hundreds] + ' ';
            result += 'cent';
            if (remainder === 0 && hundreds > 1)
                result += 's';
            if (remainder > 0)
                result += ' ';
        }
        if (remainder > 0) {
            if (remainder < 20) {
                result += units[remainder];
            }
            else {
                var ten = Math.floor(remainder / 10);
                var unit = remainder % 10;
                if (ten === 7 || ten === 9) {
                    result += tens[ten] + '-' + units[10 + unit];
                }
                else {
                    result += tens[ten];
                    if (unit === 1 && ten !== 8) {
                        result += ' et un';
                    }
                    else if (unit > 0) {
                        result += '-' + units[unit];
                    }
                    if (ten === 8 && unit === 0)
                        result += 's';
                }
            }
        }
        return result.trim();
    }
    var parts = [];
    var milliards = Math.floor(n / 1000000000);
    var millions = Math.floor((n % 1000000000) / 1000000);
    var milliers = Math.floor((n % 1000000) / 1000);
    var reste = n % 1000;
    if (milliards > 0) {
        parts.push(convertBelow1000(milliards) + ' milliard' + (milliards > 1 ? 's' : ''));
    }
    if (millions > 0) {
        parts.push(convertBelow1000(millions) + ' million' + (millions > 1 ? 's' : ''));
    }
    if (milliers > 0) {
        if (milliers === 1)
            parts.push('mille');
        else
            parts.push(convertBelow1000(milliers) + ' mille');
    }
    if (reste > 0) {
        parts.push(convertBelow1000(reste));
    }
    return parts.join(' ') + ' Ariary';
}
var ReservationService = /** @class */ (function () {
    function ReservationService(reservationRepository, clientRepository, vehiculeRepository, regionRepository, statusRepository, bonDeCommandeRepository, prixCarburantRepository, factureService) {
        this.reservationRepository = reservationRepository;
        this.clientRepository = clientRepository;
        this.vehiculeRepository = vehiculeRepository;
        this.regionRepository = regionRepository;
        this.statusRepository = statusRepository;
        this.bonDeCommandeRepository = bonDeCommandeRepository;
        this.prixCarburantRepository = prixCarburantRepository;
        this.factureService = factureService;
    }
    ReservationService.prototype.createDevis = function (dto) {
        return __awaiter(this, void 0, Promise, function () {
            var clientId, vehiculeId, pickup_date, return_date, region_id, carburant_policy, carburant_depart, client, vehicule, region, dailyRate, startDate, endDate, rentalDays, totalPrice, note, policy, lastReservation, nextNumber, lastRef, match, newReference, newDevis;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clientId = dto.clientId, vehiculeId = dto.vehiculeId, pickup_date = dto.pickup_date, return_date = dto.return_date, region_id = dto.region_id, carburant_policy = dto.carburant_policy, carburant_depart = dto.carburant_depart;
                        return [4 /*yield*/, this.clientRepository.findOneBy({ id: clientId })];
                    case 1:
                        client = _a.sent();
                        if (!client)
                            throw new common_1.NotFoundException("Client with ID " + clientId + " not found");
                        return [4 /*yield*/, this.vehiculeRepository.findOne({
                                where: { id: vehiculeId },
                                relations: ['status']
                            })];
                    case 2:
                        vehicule = _a.sent();
                        if (!vehicule)
                            throw new common_1.NotFoundException("Vehicule with ID " + vehiculeId + " not found");
                        return [4 /*yield*/, this.regionRepository.findOne({
                                where: { id: region_id },
                                relations: ['prix']
                            })];
                    case 3:
                        region = _a.sent();
                        if (!region)
                            throw new common_1.NotFoundException("Region with ID " + region_id + " not found");
                        if (!region.prix || region.prix.prix === undefined)
                            throw new common_1.NotFoundException("Pricing for region ID " + region_id + " not found");
                        dailyRate = parseFloat(String(region.prix.prix));
                        startDate = new Date(pickup_date);
                        endDate = new Date(return_date);
                        if (endDate <= startDate)
                            throw new common_1.BadRequestException('Return date must be after pickup date');
                        rentalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
                        totalPrice = rentalDays * dailyRate;
                        note = 'Sans carburant';
                        policy = carburant_policy;
                        if (policy === reservation_entity_1.CarburantPolicy.PLEIN_A_PLEIN) {
                            note = 'Carburant inclus (Plein à plein)';
                        }
                        else if (policy === reservation_entity_1.CarburantPolicy.PAY_AS_YOU_USE) {
                            note = 'Carburant à payer au retour (Pay as you use)';
                        }
                        return [4 /*yield*/, this.reservationRepository.find({
                                order: { id: 'DESC' },
                                take: 1
                            })];
                    case 4:
                        lastReservation = _a.sent();
                        nextNumber = 1;
                        if (lastReservation.length > 0) {
                            lastRef = lastReservation[0].reference;
                            match = lastRef === null || lastRef === void 0 ? void 0 : lastRef.match(/DEV-(\d+)/);
                            if (match) {
                                nextNumber = parseInt(match[1], 10) + 1;
                            }
                        }
                        newReference = "DEV-" + String(nextNumber).padStart(3, '0');
                        newDevis = this.reservationRepository.create({
                            reference: newReference,
                            client: client,
                            vehicule: vehicule,
                            pickup_date: startDate,
                            return_date: endDate,
                            location: region,
                            nombreJours: rentalDays,
                            total_price: totalPrice,
                            status: reservation_entity_1.ReservationStatus.DEVIS,
                            note: note,
                            carburant_policy: policy,
                            carburant_depart: carburant_depart,
                            createdAt: new Date()
                        });
                        return [2 /*return*/, this.reservationRepository.save(newDevis)];
                }
            });
        });
    };
    ReservationService.prototype.confirmReservation = function (reservationId) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, reservedStatus, lastBDC, nextNumber, lastRef, match, newBDCRef, bdc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.findOne({
                            where: { id: reservationId },
                            relations: ['vehicule', 'bonDeCommande']
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation)
                            throw new common_1.NotFoundException("Reservation with ID " + reservationId + " not found");
                        // Vérifier si la réservation est déjà confirmée ou a un BonDeCommande
                        if (reservation.status !== reservation_entity_1.ReservationStatus.DEVIS) {
                            throw new common_1.BadRequestException("Reservation is not in DEVIS status. Current status: " + reservation.status);
                        }
                        // Ajout de la vérification pour la contrainte d'unicité
                        if (reservation.bonDeCommande) {
                            throw new common_1.BadRequestException("A Bon de Commande already exists for this reservation.");
                        }
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Réservé' }
                            })];
                    case 2:
                        reservedStatus = _a.sent();
                        if (!reservedStatus)
                            throw new Error('Status "Réservé" not found in database');
                        reservation.vehicule.status = reservedStatus;
                        return [4 /*yield*/, this.vehiculeRepository.save(reservation.vehicule)];
                    case 3:
                        _a.sent();
                        reservation.status = reservation_entity_1.ReservationStatus.CONFIRMEE;
                        return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, this.bonDeCommandeRepository.find({
                                order: { id: 'DESC' },
                                take: 1
                            })];
                    case 5:
                        lastBDC = _a.sent();
                        nextNumber = 1;
                        if (lastBDC.length > 0) {
                            lastRef = lastBDC[0].reference;
                            match = lastRef === null || lastRef === void 0 ? void 0 : lastRef.match(/BC-(\d+)/);
                            if (match)
                                nextNumber = parseInt(match[1], 10) + 1;
                        }
                        newBDCRef = "BC-" + String(nextNumber).padStart(3, '0');
                        bdc = this.bonDeCommandeRepository.create({
                            reference: newBDCRef,
                            reservation: reservation
                        });
                        return [4 /*yield*/, this.bonDeCommandeRepository.save(bdc)];
                    case 6:
                        _a.sent();
                        return [2 /*return*/, reservation];
                }
            });
        });
    };
    ReservationService.prototype.completeReservation = function (reservationId, carburant_retour) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, carburantDepart, carburantRetour, consommation, dernierPrixCarburant, prixLitre, totalPrice, availableStatus, savedReservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.findOne({
                            where: { id: reservationId },
                            relations: [
                                'vehicule',
                                'vehicule.typeCarburant',
                                'location',
                                'location.prix',
                                'bonDeCommande',
                            ]
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation)
                            throw new common_1.NotFoundException("Reservation with ID " + reservationId + " not found");
                        if (reservation.status !== reservation_entity_1.ReservationStatus.CONFIRMEE)
                            throw new common_1.BadRequestException("Reservation is not in CONFIRMEE status");
                        if (!(reservation.carburant_policy === reservation_entity_1.CarburantPolicy.PAY_AS_YOU_USE)) return [3 /*break*/, 4];
                        carburantDepart = parseFloat(String(reservation.carburant_depart));
                        carburantRetour = parseFloat(String(carburant_retour));
                        if (isNaN(carburantDepart) || isNaN(carburantRetour)) {
                            throw new common_1.BadRequestException('Les valeurs de carburant doivent être des nombres.');
                        }
                        consommation = carburantDepart - carburantRetour;
                        if (!(consommation > 0)) return [3 /*break*/, 3];
                        if (!reservation.vehicule.typeCarburant) {
                            throw new common_1.BadRequestException("Le type de carburant du véhicule n'est pas défini.");
                        }
                        return [4 /*yield*/, this.prixCarburantRepository.findOne({
                                where: {
                                    typeCarburant: { id: reservation.vehicule.typeCarburant.id }
                                },
                                order: { date_effective: 'DESC' }
                            })];
                    case 2:
                        dernierPrixCarburant = _a.sent();
                        if (!dernierPrixCarburant) {
                            throw new common_1.NotFoundException("Prix du carburant pour le type '" + reservation.vehicule.typeCarburant.nom + "' non d\u00E9fini. Veuillez le configurer.");
                        }
                        prixLitre = parseFloat(String(dernierPrixCarburant.prix_par_litre));
                        totalPrice = parseFloat(String(reservation.total_price));
                        totalPrice += consommation * prixLitre;
                        reservation.total_price = totalPrice;
                        reservation.note = "Carburant (" + reservation.vehicule.typeCarburant.nom + ") pay\u00E9 au retour (" + consommation + " L x " + prixLitre + " Ariary)";
                        _a.label = 3;
                    case 3:
                        reservation.carburant_retour = carburant_retour;
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.statusRepository.findOne({
                            where: { status: 'Disponible' }
                        })];
                    case 5:
                        availableStatus = _a.sent();
                        if (!availableStatus)
                            throw new Error('Status "Disponible" not found in database');
                        reservation.vehicule.status = availableStatus;
                        return [4 /*yield*/, this.vehiculeRepository.save(reservation.vehicule)];
                    case 6:
                        _a.sent();
                        reservation.status = reservation_entity_1.ReservationStatus.TERMINEE;
                        return [4 /*yield*/, this.reservationRepository.save(reservation)];
                    case 7:
                        savedReservation = _a.sent();
                        return [4 /*yield*/, this.factureService.generateFactureFinale(reservation.bonDeCommande.id)];
                    case 8:
                        _a.sent();
                        return [2 /*return*/, savedReservation];
                }
            });
        });
    };
    ReservationService.prototype.cancelReservation = function (reservationId) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation, availableStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.findOne({
                            where: { id: reservationId },
                            relations: ['vehicule', 'vehicule.status', 'bonDeCommande']
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation) {
                            throw new common_1.NotFoundException("Reservation with ID " + reservationId + " not found");
                        }
                        // Vérifier si la réservation peut être annulée
                        if (reservation.status === reservation_entity_1.ReservationStatus.TERMINEE ||
                            reservation.status === reservation_entity_1.ReservationStatus.ANNULEE) {
                            throw new common_1.BadRequestException("Cannot cancel reservation in status: " + reservation.status);
                        }
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Disponible' }
                            })];
                    case 2:
                        availableStatus = _a.sent();
                        if (!availableStatus)
                            throw new Error('Status "Disponible" not found in database');
                        reservation.vehicule.status = availableStatus;
                        return [4 /*yield*/, this.vehiculeRepository.save(reservation.vehicule)];
                    case 3:
                        _a.sent();
                        // Marquer la réservation comme annulée
                        reservation.status = reservation_entity_1.ReservationStatus.ANNULEE;
                        reservation.note = "R\u00E9servation annul\u00E9e le " + new Date().toLocaleDateString();
                        return [2 /*return*/, this.reservationRepository.save(reservation)];
                }
            });
        });
    };
    ReservationService.prototype.deleteReservation = function (reservationId) {
        return __awaiter(this, void 0, Promise, function () {
            var reservation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.findOne({
                            where: { id: reservationId },
                            relations: ['bonDeCommande']
                        })];
                    case 1:
                        reservation = _a.sent();
                        if (!reservation) {
                            throw new common_1.NotFoundException("Reservation with ID " + reservationId + " not found");
                        }
                        // Empêcher la suppression des réservations confirmées ou terminées
                        if (reservation.status === reservation_entity_1.ReservationStatus.CONFIRMEE ||
                            reservation.status === reservation_entity_1.ReservationStatus.TERMINEE) {
                            throw new common_1.ForbiddenException("Cannot delete reservation in status: " + reservation.status + ". Use cancel instead.");
                        }
                        if (!reservation.bonDeCommande) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.bonDeCommandeRepository.remove(reservation.bonDeCommande)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.reservationRepository.remove(reservation)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // Mettre à jour la méthode findAll pour inclure les réservations annulées
    ReservationService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            var reservations;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.reservationRepository.find({
                            relations: [
                                'client',
                                'vehicule',
                                'vehicule.type',
                                'vehicule.status',
                                'location',
                                'location.prix',
                            ]
                        })];
                    case 1:
                        reservations = _a.sent();
                        return [2 /*return*/, reservations.map(function (res) {
                                var _a, _b;
                                var dailyRate = parseFloat(String((_b = (_a = res.location) === null || _a === void 0 ? void 0 : _a.prix) === null || _b === void 0 ? void 0 : _b.prix)) || 0;
                                return {
                                    id: res.id,
                                    reference: res.reference,
                                    client: res.client,
                                    vehicule: res.vehicule,
                                    pickup_date: res.pickup_date,
                                    return_date: res.return_date,
                                    createdAt: res.createdAt,
                                    nombreJours: res.nombreJours,
                                    prix_unitaire: dailyRate,
                                    total_price: res.total_price,
                                    total_en_lettres: numberToFrenchWords(parseFloat(String(res.total_price))),
                                    note: res.note,
                                    status: res.status,
                                    region: res.location
                                        ? {
                                            id: res.location.id,
                                            nom_region: res.location.nom_region,
                                            nom_district: res.location.nom_district
                                        }
                                        : null,
                                    // Ajouter des informations supplémentaires pour l'annulation
                                    canBeCancelled: res.status === reservation_entity_1.ReservationStatus.DEVIS ||
                                        res.status === reservation_entity_1.ReservationStatus.CONFIRMEE,
                                    canBeDeleted: res.status === reservation_entity_1.ReservationStatus.DEVIS ||
                                        res.status === reservation_entity_1.ReservationStatus.ANNULEE
                                };
                            })];
                }
            });
        });
    };
    ReservationService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(reservation_entity_1.Reservation)),
        __param(1, typeorm_1.InjectRepository(client_entity_1.Client)),
        __param(2, typeorm_1.InjectRepository(vehicle_entity_1.Vehicule)),
        __param(3, typeorm_1.InjectRepository(region_entity_1.Region)),
        __param(4, typeorm_1.InjectRepository(status_entity_1.Status)),
        __param(5, typeorm_1.InjectRepository(commande_entity_1.BonDeCommande)),
        __param(6, typeorm_1.InjectRepository(carburant_price_entity_1.PrixCarburant))
    ], ReservationService);
    return ReservationService;
}());
exports.ReservationService = ReservationService;
