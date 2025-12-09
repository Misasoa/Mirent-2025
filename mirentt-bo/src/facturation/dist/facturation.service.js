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
exports.FactureService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var facture_entity_1 = require("../entities/facture.entity");
var reservation_entity_1 = require("src/entities/reservation.entity");
var commande_entity_1 = require("src/entities/commande.entity");
var FactureService = /** @class */ (function () {
    function FactureService(factureRepository, bdcRepository, paiementService) {
        this.factureRepository = factureRepository;
        this.bdcRepository = bdcRepository;
        this.paiementService = paiementService;
    }
    FactureService.prototype.generateFactureFinaleByReference = function (bdcReference) {
        return __awaiter(this, void 0, void 0, function () {
            var bdc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bdcRepository.findOne({
                            where: { reference: bdcReference }
                        })];
                    case 1:
                        bdc = _a.sent();
                        if (!bdc) {
                            throw new common_1.NotFoundException("Bon de Commande with reference \"" + bdcReference + "\" not found");
                        }
                        return [2 /*return*/, this.generateFactureFinale(bdc.id)];
                }
            });
        });
    };
    FactureService.prototype.getAllFactures = function () {
        return __awaiter(this, void 0, void 0, function () {
            var factures;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.factureRepository.find({
                            relations: [
                                'bdc',
                                'bdc.paiements',
                                'bdc.reservation',
                                'bdc.reservation.client',
                                'bdc.reservation.vehicule',
                                'bdc.reservation.location',
                            ]
                        })];
                    case 1:
                        factures = _a.sent();
                        return [2 /*return*/, Promise.all(factures.map(function (facture) { return __awaiter(_this, void 0, void 0, function () {
                                var summary;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.paiementService.getSummary(facture.bdc.id)];
                                        case 1:
                                            summary = _a.sent();
                                            return [2 /*return*/, {
                                                    id: facture.id,
                                                    numero: facture.numero,
                                                    date_facture: facture.date_facture,
                                                    montant: facture.montant,
                                                    totalPaiements: summary.totalPaye,
                                                    resteAPayer: summary.reste,
                                                    bdc: {
                                                        id: facture.bdc.id,
                                                        reference: facture.bdc.reference,
                                                        created_at: facture.bdc.created_at,
                                                        reservation: {
                                                            id: facture.bdc.reservation.id,
                                                            reference: facture.bdc.reservation.reference,
                                                            client: facture.bdc.reservation.client,
                                                            vehicule: facture.bdc.reservation.vehicule,
                                                            region: facture.bdc.reservation.location,
                                                            pickup_date: facture.bdc.reservation.pickup_date,
                                                            return_date: facture.bdc.reservation.return_date,
                                                            total_price: facture.bdc.reservation.total_price,
                                                            nombreJours: facture.bdc.reservation.nombreJours
                                                        }
                                                    },
                                                    paiements: facture.bdc.paiements.map(function (p) { return ({
                                                        id: p.id,
                                                        montant: p.montant,
                                                        methode: p.methode,
                                                        reference_transaction: p.reference_transaction,
                                                        date_paiement: p.date_paiement
                                                    }); })
                                                }];
                                    }
                                });
                            }); }))];
                }
            });
        });
    };
    FactureService.prototype.getFactureById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var facture, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.factureRepository.findOne({
                            where: { id: id },
                            relations: [
                                'bdc',
                                'bdc.paiements',
                                'bdc.reservation',
                                'bdc.reservation.client',
                                'bdc.reservation.vehicule',
                                'bdc.reservation.location',
                            ]
                        })];
                    case 1:
                        facture = _a.sent();
                        if (!facture)
                            throw new common_1.NotFoundException("Facture " + id + " introuvable");
                        return [4 /*yield*/, this.paiementService.getSummary(facture.bdc.id)];
                    case 2:
                        summary = _a.sent();
                        return [2 /*return*/, {
                                id: facture.id,
                                numero: facture.numero,
                                date_facture: facture.date_facture,
                                montant: facture.montant,
                                totalPaiements: summary.totalPaye,
                                resteAPayer: summary.reste,
                                bdc: {
                                    id: facture.bdc.id,
                                    reference: facture.bdc.reference,
                                    created_at: facture.bdc.created_at,
                                    reservation: {
                                        id: facture.bdc.reservation.id,
                                        reference: facture.bdc.reservation.reference,
                                        client: facture.bdc.reservation.client,
                                        vehicule: facture.bdc.reservation.vehicule,
                                        region: facture.bdc.reservation.location,
                                        pickup_date: facture.bdc.reservation.pickup_date,
                                        return_date: facture.bdc.reservation.return_date,
                                        total_price: facture.bdc.reservation.total_price,
                                        nombreJours: facture.bdc.reservation.nombreJours
                                    }
                                },
                                paiements: facture.bdc.paiements.map(function (p) { return ({
                                    id: p.id,
                                    montant: p.montant,
                                    methode: p.methode,
                                    reference_transaction: p.reference_transaction,
                                    date_paiement: p.date_paiement
                                }); })
                            }];
                }
            });
        });
    };
    FactureService.prototype.generateFactureFinale = function (bdcId) {
        return __awaiter(this, void 0, void 0, function () {
            var bdc, facture, count, today, year, month, day, numero, summary;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bdcRepository.findOne({
                            where: { id: bdcId },
                            relations: [
                                'reservation',
                                'reservation.client',
                                'reservation.vehicule',
                                'reservation.location',
                                'paiements',
                            ]
                        })];
                    case 1:
                        bdc = _a.sent();
                        if (!bdc)
                            throw new common_1.NotFoundException("BDC " + bdcId + " non trouv\u00E9");
                        if (bdc.reservation.status !== reservation_entity_1.ReservationStatus.TERMINEE) {
                            throw new common_1.BadRequestException("R\u00E9servation non termin\u00E9e, impossible de g\u00E9n\u00E9rer la facture");
                        }
                        return [4 /*yield*/, this.factureRepository.findOne({
                                where: { bdc: { id: bdcId } }
                            })];
                    case 2:
                        facture = _a.sent();
                        if (!!facture) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.factureRepository.count()];
                    case 3:
                        count = _a.sent();
                        today = new Date();
                        year = today.getFullYear();
                        month = String(today.getMonth() + 1).padStart(2, '0');
                        day = String(today.getDate()).padStart(2, '0');
                        numero = "MRT-" + year + "/" + month + "/" + day + "-" + (count + 1).toString().padStart(4, '0');
                        facture = this.factureRepository.create({
                            numero: numero,
                            montant: bdc.reservation.total_price,
                            bdc: bdc
                        });
                        return [4 /*yield*/, this.factureRepository.save(facture)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.paiementService.getSummary(bdc.id)];
                    case 6:
                        summary = _a.sent();
                        // Retourner le JSON complet
                        return [2 /*return*/, {
                                id: facture.id,
                                numero: facture.numero,
                                date_facture: facture.date_facture,
                                montant: facture.montant,
                                totalPaiements: summary.totalPaye,
                                resteAPayer: summary.reste,
                                bdc: {
                                    id: bdc.id,
                                    reference: bdc.reference,
                                    created_at: bdc.created_at,
                                    reservation: bdc.reservation,
                                    paiements: bdc.paiements
                                }
                            }];
                }
            });
        });
    };
    FactureService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(facture_entity_1.Facture)),
        __param(1, typeorm_1.InjectRepository(commande_entity_1.BonDeCommande))
    ], FactureService);
    return FactureService;
}());
exports.FactureService = FactureService;
