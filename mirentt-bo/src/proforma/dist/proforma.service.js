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
exports.ProformaService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var proforma_entity_1 = require("src/entities/proforma.entity");
var proformat_item_entity_1 = require("src/entities/proformat-item.entity");
var typeorm_2 = require("typeorm");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var region_entity_1 = require("src/entities/region.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var status_entity_1 = require("src/entities/status.entity");
var client_entity_1 = require("src/entities/client.entity");
var type_entity_1 = require("src/entities/type.entity");
var ProformaService = /** @class */ (function () {
    function ProformaService(proformaRepository, proformaItemRepository, vehiculeRepository, regionRepository, prixRepository, statusRepository, clientRepository, typeRepository, pdfService, mailService) {
        this.proformaRepository = proformaRepository;
        this.proformaItemRepository = proformaItemRepository;
        this.vehiculeRepository = vehiculeRepository;
        this.regionRepository = regionRepository;
        this.prixRepository = prixRepository;
        this.statusRepository = statusRepository;
        this.clientRepository = clientRepository;
        this.typeRepository = typeRepository;
        this.pdfService = pdfService;
        this.mailService = mailService;
    }
    ProformaService.prototype.generateProformaNumber = function () {
        return __awaiter(this, void 0, Promise, function () {
            var lastProforma, numero, lastNumberMatch, date, mois, annee;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.find({
                            order: { id: 'DESC' },
                            take: 1
                        })];
                    case 1:
                        lastProforma = _a.sent();
                        numero = 1;
                        if (lastProforma.length > 0) {
                            lastNumberMatch = lastProforma[0].proformaNumber.match(/MRT (\d+)PROF/);
                            if (lastNumberMatch) {
                                numero = parseInt(lastNumberMatch[1], 10) + 1;
                            }
                        }
                        date = new Date();
                        mois = String(date.getMonth() + 1).padStart(2, '0');
                        annee = date.getFullYear();
                        return [2 /*return*/, "FACTURE PROFORMA N\u00B0 MRT " + String(numero).padStart(3, '0') + "PROF/" + mois + "/" + annee];
                }
            });
        });
    };
    ProformaService.prototype.create = function (proformaData) {
        return __awaiter(this, void 0, Promise, function () {
            var clientExist, proforma, _a, _b, _c, _d, proformaItems, _e, savedProforma, savedProformaWithRelations, pdfBuffer;
            var _this = this;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.findOne({
                            where: [
                                { lastName: proformaData.clientLastName },
                                { email: proformaData.clientEmail },
                                { phone: proformaData.clientPhone },
                            ]
                        })];
                    case 1:
                        clientExist = _f.sent();
                        if (!clientExist) {
                            throw new common_1.NotFoundException("Client not found with the provided information");
                        }
                        _b = (_a = this.proformaRepository).create;
                        _c = {
                            client: clientExist,
                            date: proformaData.date,
                            contractReference: proformaData.contractReference,
                            notes: proformaData.notes
                        };
                        return [4 /*yield*/, this.generateProformaNumber()];
                    case 2:
                        proforma = _b.apply(_a, [(_c.proformaNumber = _f.sent(),
                                _c)]);
                        _d = proforma;
                        return [4 /*yield*/, this.generateProformaNumber()];
                    case 3:
                        _d.proformaNumber = _f.sent();
                        return [4 /*yield*/, Promise.all(proformaData.items.map(function (item) { return __awaiter(_this, void 0, void 0, function () {
                                var regionExist, prixExist, statusDisponible, whereClause, typeExist, availableVehicles, vehiculeChoisi, vehiculeDejaLoue, dureeLocation, prixNumerique, subTotalCalculated, proformaItem, statusIndisponible;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.regionRepository.findOne({
                                                where: { nom_region: item.regionName },
                                                relations: ['prix']
                                            })];
                                        case 1:
                                            regionExist = _a.sent();
                                            if (!regionExist) {
                                                throw new common_1.NotFoundException("Region with name \"" + item.regionName + "\" not found");
                                            }
                                            if (!regionExist.prix) {
                                                throw new common_1.NotFoundException("Price not found for the region \"" + item.regionName + "\"");
                                            }
                                            prixExist = regionExist.prix;
                                            return [4 /*yield*/, this.statusRepository.findOne({
                                                    where: { status: 'Disponible' }
                                                })];
                                        case 2:
                                            statusDisponible = _a.sent();
                                            if (!statusDisponible) {
                                                throw new common_1.NotFoundException("Statut \"Disponible\" non trouv\u00E9");
                                            }
                                            whereClause = __assign(__assign({}, item.vehicleCriteria), { status: { id: statusDisponible.id } });
                                            if (!item.vehicleCriteria.type) return [3 /*break*/, 4];
                                            return [4 /*yield*/, this.typeRepository.findOne({
                                                    where: { type: item.vehicleCriteria.type }
                                                })];
                                        case 3:
                                            typeExist = _a.sent();
                                            if (!typeExist) {
                                                throw new common_1.NotFoundException("Type \"" + item.vehicleCriteria.type + "\" not found");
                                            }
                                            whereClause.type = typeExist;
                                            delete whereClause.type;
                                            _a.label = 4;
                                        case 4:
                                            console.log('Critères de recherche :', whereClause);
                                            return [4 /*yield*/, this.vehiculeRepository.find({
                                                    where: whereClause,
                                                    relations: ['type', 'status']
                                                })];
                                        case 5:
                                            availableVehicles = _a.sent();
                                            if (!availableVehicles || availableVehicles.length === 0) {
                                                throw new common_1.NotFoundException("No available vehicle found for the given criteria");
                                            }
                                            vehiculeChoisi = availableVehicles[0];
                                            return [4 /*yield*/, this.proformaItemRepository.findOne({
                                                    where: {
                                                        vehicle: { id: vehiculeChoisi.id },
                                                        dateDepart: item.dateDepart,
                                                        dateRetour: item.dateRetour
                                                    }
                                                })];
                                        case 6:
                                            vehiculeDejaLoue = _a.sent();
                                            if (vehiculeDejaLoue) {
                                                throw new common_1.BadRequestException("Le v\u00E9hicule \"" + vehiculeChoisi.nom + "\" (ID: " + vehiculeChoisi.id + ") est d\u00E9j\u00E0 lou\u00E9 pour cette p\u00E9riode");
                                            }
                                            dureeLocation = Math.ceil((new Date(item.dateRetour).getTime() -
                                                new Date(item.dateDepart).getTime()) /
                                                (1000 * 3600 * 24));
                                            prixNumerique = Number(prixExist.prix);
                                            subTotalCalculated = prixNumerique * dureeLocation;
                                            console.log('Création ProformaItem - prixExist.prix:', prixExist.prix, 'dureeLocation:', dureeLocation, 'subTotalCalculated:', subTotalCalculated);
                                            proformaItem = this.proformaItemRepository.create({
                                                vehicle: vehiculeChoisi,
                                                region: regionExist,
                                                prix: prixExist,
                                                dateDepart: new Date(item.dateDepart),
                                                dateRetour: new Date(item.dateRetour),
                                                nombreJours: dureeLocation,
                                                subTotal: subTotalCalculated
                                            });
                                            return [4 /*yield*/, this.statusRepository.findOne({
                                                    where: { status: 'Réservé' }
                                                })];
                                        case 7:
                                            statusIndisponible = _a.sent();
                                            if (!statusIndisponible) {
                                                throw new common_1.NotFoundException("Statut \"R\u00E9serv\u00E9\" non trouv\u00E9");
                                            }
                                            vehiculeChoisi.status = statusIndisponible;
                                            return [4 /*yield*/, this.vehiculeRepository.save(vehiculeChoisi)];
                                        case 8:
                                            _a.sent();
                                            return [2 /*return*/, proformaItem];
                                    }
                                });
                            }); }))];
                    case 4:
                        proformaItems = _f.sent();
                        _e = proforma;
                        return [4 /*yield*/, this.proformaItemRepository.save(proformaItems)];
                    case 5:
                        _e.items = _f.sent();
                        proforma.totalAmount = proforma.items.reduce(function (sum, item) { return sum + Number(item.subTotal); }, 0);
                        console.log('Total amount (before toFixed):', proforma.totalAmount);
                        console.log('Type of total amount:', typeof proforma.totalAmount);
                        proforma.totalAmount = Number(proforma.totalAmount.toFixed(2));
                        console.log('Total amount (after toFixed):', proforma.totalAmount);
                        console.log('Type of total amount:', typeof proforma.totalAmount);
                        return [4 /*yield*/, this.proformaRepository.save(proforma)];
                    case 6:
                        savedProforma = _f.sent();
                        return [4 /*yield*/, this.proformaRepository.findOne({
                                where: { id: savedProforma.id },
                                relations: [
                                    'items',
                                    'items.vehicle',
                                    'items.vehicle.type',
                                    'items.vehicle.status',
                                    'items.region',
                                    'items.prix',
                                    'client',
                                ]
                            })];
                    case 7:
                        savedProformaWithRelations = _f.sent();
                        console.log('Saved proforma with relations:', savedProformaWithRelations);
                        return [4 /*yield*/, this.pdfService.generateProformaPdf(savedProformaWithRelations)];
                    case 8:
                        pdfBuffer = _f.sent();
                        if (!savedProformaWithRelations) {
                            throw new common_1.NotFoundException('Proforma not found after saving.');
                        }
                        return [2 /*return*/, {
                                message: 'Le proforma a été créé avec succès !',
                                proforma: savedProformaWithRelations,
                                pdfBuffer: pdfBuffer
                            }];
                }
            });
        });
    };
    ProformaService.prototype.updateStatus = function (id, newStatus) {
        return __awaiter(this, void 0, Promise, function () {
            var proforma;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.findOne({
                            where: { id: Number(id) }
                        })];
                    case 1:
                        proforma = _a.sent();
                        if (!proforma) {
                            throw new common_1.NotFoundException("Proforma with ID " + id + " not found");
                        }
                        proforma.status = newStatus;
                        return [2 /*return*/, this.proformaRepository.save(proforma)];
                }
            });
        });
    };
    ProformaService.prototype.findAvailableVehicles = function (criteria) {
        return __awaiter(this, void 0, Promise, function () {
            var marque, modele, type, dateDepart, dateRetour, statusDisponible, whereClause, typeExist, allMatchingVehicles, unavailableVehicles, unavailableVehicleIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        marque = criteria.marque, modele = criteria.modele, type = criteria.type, dateDepart = criteria.dateDepart, dateRetour = criteria.dateRetour;
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Disponible' }
                            })];
                    case 1:
                        statusDisponible = _a.sent();
                        if (!statusDisponible) {
                            throw new common_1.NotFoundException("Statut \"Disponible\" non trouv\u00E9");
                        }
                        whereClause = { status: { id: statusDisponible.id } };
                        if (marque) {
                            whereClause.marque = marque;
                        }
                        if (modele) {
                            whereClause.modele = modele;
                        }
                        if (!type) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.typeRepository.findOne({ where: { type: type } })];
                    case 2:
                        typeExist = _a.sent();
                        if (!typeExist) {
                            throw new common_1.NotFoundException("Type \"" + type + "\" non trouv\u00E9");
                        }
                        whereClause.type = typeExist;
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.vehiculeRepository.find({
                            where: whereClause,
                            relations: ['type', 'status']
                        })];
                    case 4:
                        allMatchingVehicles = _a.sent();
                        return [4 /*yield*/, this.proformaItemRepository.find({
                                where: [
                                    {
                                        dateDepart: typeorm_2.LessThanOrEqual(dateRetour),
                                        dateRetour: typeorm_2.MoreThanOrEqual(dateDepart)
                                    },
                                ],
                                relations: ['vehicle']
                            })];
                    case 5:
                        unavailableVehicles = _a.sent();
                        unavailableVehicleIds = unavailableVehicles.map(function (item) { return item.vehicle.id; });
                        return [2 /*return*/, allMatchingVehicles.filter(function (vehicle) { return !unavailableVehicleIds.includes(vehicle.id); })];
                }
            });
        });
    };
    ProformaService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var proforma;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.findOne({
                            where: { id: id },
                            relations: [
                                'items',
                                'items.vehicle',
                                'items.vehicle.type',
                                'items.vehicle.status',
                                'items.region',
                                'items.prix',
                                'client',
                            ]
                        })];
                    case 1:
                        proforma = _a.sent();
                        if (!proforma) {
                            throw new common_1.NotFoundException("Proforma with ID " + id + " not found");
                        }
                        return [2 /*return*/, proforma];
                }
            });
        });
    };
    ProformaService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.proformaRepository.find({
                        relations: [
                            'items',
                            'items.vehicle',
                            'items.vehicle.type',
                            'items.vehicle.status',
                            'items.region',
                            'items.prix',
                            'client',
                        ]
                    })];
            });
        });
    };
    ProformaService.prototype["delete"] = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var proforma, statusDisponible, _i, _a, item, vehicle;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.findOne({
                            where: { id: id },
                            relations: ['items', 'items.vehicle']
                        })];
                    case 1:
                        proforma = _b.sent();
                        if (!proforma) {
                            throw new common_1.NotFoundException("Proforma with ID " + id + " not found");
                        }
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: 'Disponible' }
                            })];
                    case 2:
                        statusDisponible = _b.sent();
                        if (!statusDisponible) {
                            throw new common_1.NotFoundException("Statut \"Disponible\" non trouv\u00E9");
                        }
                        _i = 0, _a = proforma.items;
                        _b.label = 3;
                    case 3:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        item = _a[_i];
                        vehicle = item.vehicle;
                        vehicle.status = statusDisponible;
                        return [4 /*yield*/, this.vehiculeRepository.save(vehicle)];
                    case 4:
                        _b.sent();
                        _b.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: 
                    // Supprimer les éléments du proforma
                    return [4 /*yield*/, this.proformaItemRepository["delete"]({ proforma: { id: id } })];
                    case 7:
                        // Supprimer les éléments du proforma
                        _b.sent();
                        // Supprimer le proforma
                        return [4 /*yield*/, this.proformaRepository["delete"](id)];
                    case 8:
                        // Supprimer le proforma
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // mettre à jour un proforma
    ProformaService.prototype.update = function (id, updateDto) {
        return __awaiter(this, void 0, Promise, function () {
            var item, region, vehicleCriteria, typeEntity, vehicle, prix, prixValue;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaItemRepository.findOne({
                            where: { id: id },
                            relations: ['region', 'vehicle', 'prix', 'vehicle.type']
                        })];
                    case 1:
                        item = _a.sent();
                        if (!item) {
                            throw new common_1.NotFoundException("Proforma item avec l'id " + id + " non trouv\u00E9.");
                        }
                        if (!updateDto.regionName) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.regionRepository.findOne({
                                where: { nom_region: updateDto.regionName }
                            })];
                    case 2:
                        region = _a.sent();
                        if (!region) {
                            throw new common_1.NotFoundException("R\u00E9gion avec le nom \"" + updateDto.regionName + "\" non trouv\u00E9e.");
                        }
                        item.region = region;
                        _a.label = 3;
                    case 3:
                        if (!updateDto.vehicleCriteria) return [3 /*break*/, 8];
                        vehicleCriteria = __assign({}, updateDto.vehicleCriteria);
                        if (!vehicleCriteria.type) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.typeRepository.findOne({
                                where: { type: vehicleCriteria.type }
                            })];
                    case 4:
                        typeEntity = _a.sent();
                        if (!typeEntity) {
                            throw new common_1.NotFoundException("Type de v\u00E9hicule \"" + vehicleCriteria.type + "\" non trouv\u00E9.");
                        }
                        vehicleCriteria.type = typeEntity;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, this.vehiculeRepository.findOne({
                            where: vehicleCriteria
                        })];
                    case 6:
                        vehicle = _a.sent();
                        if (!vehicle) {
                            throw new common_1.NotFoundException("V\u00E9hicule avec les crit\u00E8res fournis non trouv\u00E9.");
                        }
                        if (updateDto.vehicleCriteria.marque)
                            vehicle.marque = updateDto.vehicleCriteria.marque;
                        if (updateDto.vehicleCriteria.modele)
                            vehicle.modele = updateDto.vehicleCriteria.modele;
                        if (updateDto.vehicleCriteria.type) {
                        }
                        return [4 /*yield*/, this.vehiculeRepository.save(vehicle)];
                    case 7:
                        _a.sent();
                        item.vehicle = vehicle;
                        _a.label = 8;
                    case 8:
                        // Mise à jour des dates
                        if (updateDto.dateDepart)
                            item.dateDepart = updateDto.dateDepart;
                        if (updateDto.dateRetour)
                            item.dateRetour = updateDto.dateRetour;
                        if (!updateDto.prixId) return [3 /*break*/, 10];
                        return [4 /*yield*/, this.prixRepository.findOne({
                                where: { id: updateDto.prixId }
                            })];
                    case 9:
                        prix = _a.sent();
                        if (!prix) {
                            throw new common_1.BadRequestException("Prix avec l'id " + updateDto.prixId + " non trouv\u00E9.");
                        }
                        item.prix = prix;
                        _a.label = 10;
                    case 10:
                        // Mise à jour du nombre de jours
                        if (updateDto.nombreJours !== undefined) {
                            item.nombreJours = updateDto.nombreJours;
                        }
                        // Recalcul du subTotal si prix et nombreJours sont présents
                        if (item.prix && item.nombreJours !== undefined) {
                            prixValue = typeof item.prix.prix === 'number'
                                ? item.prix.prix
                                : Number(item.prix.prix);
                            item.subTotal = prixValue * item.nombreJours;
                        }
                        return [2 /*return*/, this.proformaItemRepository.save(item)];
                }
            });
        });
    };
    // Nouvelle méthode pour servir le PDF
    ProformaService.prototype.getProformaPdf = function (id, res) {
        return __awaiter(this, void 0, Promise, function () {
            var proformaWithRelations, pdfBuffer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.proformaRepository.findOne({
                            where: { id: id },
                            relations: [
                                'items',
                                'items.vehicle',
                                'items.vehicle.type',
                                'items.vehicle.status',
                                'items.region',
                                'items.prix',
                                'client',
                            ]
                        })];
                    case 1:
                        proformaWithRelations = _a.sent();
                        if (!proformaWithRelations) {
                            throw new common_1.NotFoundException("Proforma with ID " + id + " not found");
                        }
                        return [4 /*yield*/, this.pdfService.generateProformaPdf(proformaWithRelations)];
                    case 2:
                        pdfBuffer = _a.sent();
                        // Configuration des headers pour indiquer au navigateur qu'il s'agit d'un PDF à télécharger
                        res.setHeader('Content-Type', 'application/pdf');
                        res.setHeader('Content-Disposition', "attachment; filename=\"proforma_" + proformaWithRelations.proformaNumber + ".pdf\"");
                        // Envoyer le buffer du PDF en réponse
                        res.send(pdfBuffer);
                        return [2 /*return*/];
                }
            });
        });
    };
    ProformaService.prototype.getProformaItemsByClientId = function (clientId) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.proformaItemRepository.find({
                        where: {
                            proforma: {
                                client: { id: clientId }
                            }
                        },
                        relations: ['proforma', 'proforma.client', 'vehicle', 'region', 'prix']
                    })];
            });
        });
    };
    ProformaService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(proforma_entity_1.Proforma)),
        __param(1, typeorm_1.InjectRepository(proformat_item_entity_1.ProformaItem)),
        __param(2, typeorm_1.InjectRepository(vehicle_entity_1.Vehicule)),
        __param(3, typeorm_1.InjectRepository(region_entity_1.Region)),
        __param(4, typeorm_1.InjectRepository(prix_entity_1.Prix)),
        __param(5, typeorm_1.InjectRepository(status_entity_1.Status)),
        __param(6, typeorm_1.InjectRepository(client_entity_1.Client)),
        __param(7, typeorm_1.InjectRepository(type_entity_1.Type))
    ], ProformaService);
    return ProformaService;
}());
exports.ProformaService = ProformaService;
