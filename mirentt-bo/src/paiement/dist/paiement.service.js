"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.PaiementService = void 0;
// src/paiement/paiement.service.ts
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var paiement_entity_1 = require("../entities/paiement.entity");
var commande_entity_1 = require("src/entities/commande.entity");
var PaiementService = /** @class */ (function () {
    function PaiementService(paiementRepository, bdcRepository) {
        this.paiementRepository = paiementRepository;
        this.bdcRepository = bdcRepository;
    }
    PaiementService.prototype.getAllPaiementsWithDetails = function () {
        return __awaiter(this, void 0, void 0, function () {
            var paiements, paiementsWithDetails;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.paiementRepository.find({
                            relations: [
                                'bdc',
                                'bdc.reservation',
                                'bdc.reservation.client',
                                'bdc.reservation.vehicule',
                                'bdc.reservation.location',
                            ]
                        })];
                    case 1:
                        paiements = _a.sent();
                        return [4 /*yield*/, Promise.all(paiements.map(function (paiement) { return __awaiter(_this, void 0, void 0, function () {
                                var resume;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!paiement.bdc) {
                                                return [2 /*return*/, __assign(__assign({}, paiement), { details_bdc: null, resume_paiement: null })];
                                            }
                                            return [4 /*yield*/, this.getSummary(paiement.bdc.id)];
                                        case 1:
                                            resume = _a.sent();
                                            return [2 /*return*/, __assign(__assign({}, paiement), { details_bdc: paiement.bdc, resume_paiement: resume })];
                                    }
                                });
                            }); }))];
                    case 2:
                        paiementsWithDetails = _a.sent();
                        return [2 /*return*/, paiementsWithDetails];
                }
            });
        });
    };
    // Méthode modifiée pour accepter une référence
    PaiementService.prototype.addPaiement = function (bdcReference, montant, methode, reference) {
        return __awaiter(this, void 0, void 0, function () {
            var bdc, summary, paiement, savedPaiement, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.bdcRepository.findOne({
                            where: { reference: bdcReference },
                            relations: ['reservation']
                        })];
                    case 1:
                        bdc = _c.sent();
                        if (!bdc) {
                            throw new common_1.NotFoundException("BDC avec la r\u00E9f\u00E9rence '" + bdcReference + "' non trouv\u00E9");
                        }
                        return [4 /*yield*/, this.getSummary(bdc.id)];
                    case 2:
                        summary = _c.sent();
                        if (montant > summary.reste) {
                            throw new common_1.BadRequestException("Le montant du paiement (" + montant + ") d\u00E9passe le reste \u00E0 payer (" + summary.reste + ").");
                        }
                        paiement = this.paiementRepository.create({
                            montant: montant,
                            methode: methode,
                            reference_transaction: reference || null,
                            bdc: bdc
                        });
                        return [4 /*yield*/, this.paiementRepository.save(paiement)];
                    case 3:
                        savedPaiement = _c.sent();
                        _a = [__assign({}, savedPaiement)];
                        _b = { details_bdc: bdc };
                        return [4 /*yield*/, this.getSummary(bdc.id)];
                    case 4: 
                    // 4. Retourner les données formatées
                    return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.resume_paiement = _c.sent(), _b)]))];
                }
            });
        });
    };
    PaiementService.prototype.getPaiements = function (bdcId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.paiementRepository.find({
                        where: { bdc: { id: bdcId } },
                        relations: ['bdc']
                    })];
            });
        });
    };
    PaiementService.prototype.getTotalPaye = function (bdcId) {
        return __awaiter(this, void 0, Promise, function () {
            var paiements;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getPaiements(bdcId)];
                    case 1:
                        paiements = _a.sent();
                        return [2 /*return*/, paiements.reduce(function (sum, p) { return sum + Number(p.montant); }, 0)];
                }
            });
        });
    };
    PaiementService.prototype.getResteAPayer = function (bdcId) {
        return __awaiter(this, void 0, Promise, function () {
            var bdc, montantTotal, totalPaye, reste;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bdcRepository.findOne({
                            where: { id: bdcId },
                            relations: ['reservation']
                        })];
                    case 1:
                        bdc = _a.sent();
                        if (!bdc) {
                            throw new common_1.NotFoundException("BDC " + bdcId + " non trouv\u00E9");
                        }
                        if (!bdc.reservation) {
                            throw new common_1.NotFoundException("Aucune r\u00E9servation associ\u00E9e au BDC " + bdcId);
                        }
                        montantTotal = Number(bdc.reservation.total_price);
                        return [4 /*yield*/, this.getTotalPaye(bdcId)];
                    case 2:
                        totalPaye = _a.sent();
                        reste = montantTotal - totalPaye;
                        return [2 /*return*/, reste > 0 ? reste : 0];
                }
            });
        });
    };
    PaiementService.prototype.getSummary = function (bdcId) {
        return __awaiter(this, void 0, void 0, function () {
            var bdc, montantTotal, totalPaye, reste;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.bdcRepository.findOne({
                            where: { id: bdcId },
                            relations: ['reservation']
                        })];
                    case 1:
                        bdc = _a.sent();
                        if (!bdc)
                            throw new common_1.NotFoundException("BDC " + bdcId + " non trouv\u00E9");
                        if (!bdc.reservation)
                            throw new common_1.NotFoundException("Aucune r\u00E9servation associ\u00E9e au BDC " + bdcId);
                        montantTotal = Number(bdc.reservation.total_price);
                        return [4 /*yield*/, this.getTotalPaye(bdcId)];
                    case 2:
                        totalPaye = _a.sent();
                        reste = montantTotal - totalPaye > 0 ? montantTotal - totalPaye : 0;
                        return [2 /*return*/, {
                                bdcId: bdcId,
                                montantTotal: montantTotal,
                                totalPaye: totalPaye,
                                reste: reste
                            }];
                }
            });
        });
    };
    PaiementService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(paiement_entity_1.Paiement)),
        __param(1, typeorm_1.InjectRepository(commande_entity_1.BonDeCommande))
    ], PaiementService);
    return PaiementService;
}());
exports.PaiementService = PaiementService;
