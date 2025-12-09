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
exports.VehiclesService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var type_entity_1 = require("src/entities/type.entity");
var status_entity_1 = require("src/entities/status.entity");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var VehiclesService = /** @class */ (function () {
    function VehiclesService(vehiculeRepository, typeRepository, statusRepository) {
        this.vehiculeRepository = vehiculeRepository;
        this.typeRepository = typeRepository;
        this.statusRepository = statusRepository;
    }
    VehiclesService.prototype.getAvailableVehiculeCount = function () {
        return __awaiter(this, void 0, Promise, function () {
            var availableStatus, availableVehiculeCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.statusRepository.findOne({
                            where: { status: 'Disponible' },
                            relations: ['vehicules']
                        })];
                    case 1:
                        availableStatus = _a.sent();
                        if (!availableStatus) {
                            throw new common_1.NotFoundException('Statut "Disponible" non trouvé');
                        }
                        return [4 /*yield*/, this.vehiculeRepository.count({
                                where: {
                                    status: availableStatus
                                }
                            })];
                    case 2:
                        availableVehiculeCount = _a.sent();
                        return [2 /*return*/, availableVehiculeCount];
                }
            });
        });
    };
    VehiclesService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.vehiculeRepository.find({ relations: ['type', 'status'] })];
            });
        });
    };
    VehiclesService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculeRepository.findOne({
                            where: { id: id },
                            relations: ['type', 'status']
                        })];
                    case 1: return [2 /*return*/, ((_a.sent()) || null)];
                }
            });
        });
    };
    VehiclesService.prototype.create = function (dto, imageUrl) {
        return __awaiter(this, void 0, Promise, function () {
            var type, status, vehicule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log('DTO reçu :', dto);
                        return [4 /*yield*/, this.typeRepository.findOne({
                                where: { id: dto.typeId }
                            })];
                    case 1:
                        type = _a.sent();
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { id: dto.statusId }
                            })];
                    case 2:
                        status = _a.sent();
                        console.log('Type récupéré :', type);
                        console.log('Status récupéré :', status);
                        if (!type || !status) {
                            throw new Error('Type ou Status non trouvé');
                        }
                        vehicule = this.vehiculeRepository.create(__assign(__assign({}, dto), { type: type,
                            status: status, imageUrl: imageUrl || undefined }));
                        console.log('Vehicule à sauvegarder :', vehicule);
                        return [2 /*return*/, this.vehiculeRepository.save(vehicule)];
                }
            });
        });
    };
    VehiclesService.prototype.update = function (id, dto, imageUrl) {
        return __awaiter(this, void 0, Promise, function () {
            var vehicule, status, type, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Mise \u00E0 jour du v\u00E9hicule avec l'ID : " + id);
                        console.log('DTO reçu :', dto);
                        return [4 /*yield*/, this.vehiculeRepository.findOne({
                                where: { id: id },
                                relations: ['type', 'status']
                            })];
                    case 1:
                        vehicule = _a.sent();
                        if (!vehicule) {
                            throw new common_1.NotFoundException('Véhicule non trouvé');
                        }
                        console.log('Véhicule récupéré :', vehicule);
                        if (!(dto.statusId !== undefined)) return [3 /*break*/, 3];
                        console.log('Status avant modification :', vehicule.status);
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { id: dto.statusId }
                            })];
                    case 2:
                        status = _a.sent();
                        if (!status) {
                            throw new common_1.BadRequestException('Status non trouvé');
                        }
                        vehicule.status = status;
                        console.log('Status après modification :', vehicule.status);
                        _a.label = 3;
                    case 3:
                        if (!(dto.typeId !== undefined)) return [3 /*break*/, 5];
                        console.log('Type avant modification :', vehicule.type);
                        return [4 /*yield*/, this.typeRepository.findOne({
                                where: { id: dto.typeId }
                            })];
                    case 4:
                        type = _a.sent();
                        if (!type) {
                            throw new common_1.BadRequestException('Type non trouvé');
                        }
                        vehicule.type = type;
                        console.log('Type après modification :', vehicule.type);
                        _a.label = 5;
                    case 5:
                        vehicule.nom = dto.nom || vehicule.nom;
                        vehicule.marque = dto.marque || vehicule.marque;
                        vehicule.modele = dto.modele || vehicule.modele;
                        vehicule.immatriculation = dto.immatriculation || vehicule.immatriculation;
                        vehicule.nombrePlace = dto.nombrePlace || vehicule.nombrePlace;
                        vehicule.imageUrl = imageUrl || vehicule.imageUrl;
                        console.log('Véhicule avant sauvegarde :', vehicule);
                        return [4 /*yield*/, this.vehiculeRepository.save(vehicule)];
                    case 6:
                        result = _a.sent();
                        console.log('Véhicule après sauvegarde :', result);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    // mettre à jour le status d'un véhicule par son nom
    // Cette méthode recherche le véhicule par son ID, puis met à jour son statut
    VehiclesService.prototype.updateStatusByName = function (vehicleId, statusName) {
        return __awaiter(this, void 0, Promise, function () {
            var vehicule, newStatus;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculeRepository.findOne({
                            where: { id: vehicleId },
                            relations: ['status']
                        })];
                    case 1:
                        vehicule = _a.sent();
                        if (!vehicule) {
                            throw new common_1.NotFoundException('Véhicule non trouvé');
                        }
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { status: statusName }
                            })];
                    case 2:
                        newStatus = _a.sent();
                        if (!newStatus) {
                            throw new common_1.NotFoundException("Statut \"" + statusName + "\" introuvable");
                        }
                        vehicule.status = newStatus;
                        return [4 /*yield*/, this.vehiculeRepository.save(vehicule)];
                    case 3: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    VehiclesService.prototype.updateStatus = function (id, statusId) {
        return __awaiter(this, void 0, Promise, function () {
            var vehicule, status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculeRepository.findOne({
                            where: { id: id },
                            relations: ['status']
                        })];
                    case 1:
                        vehicule = _a.sent();
                        if (!vehicule) {
                            throw new common_1.NotFoundException('Véhicule non trouvé');
                        }
                        return [4 /*yield*/, this.statusRepository.findOne({
                                where: { id: statusId }
                            })];
                    case 2:
                        status = _a.sent();
                        if (!status) {
                            throw new common_1.NotFoundException('Statut non trouvé');
                        }
                        vehicule.status = status;
                        return [2 /*return*/, this.vehiculeRepository.save(vehicule)];
                }
            });
        });
    };
    VehiclesService.prototype.initStatuses = function () {
        return __awaiter(this, void 0, Promise, function () {
            var statusNames, _i, statusNames_1, name, existing;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        statusNames = ['Disponible', 'Maintenance', 'Réservé'];
                        _i = 0, statusNames_1 = statusNames;
                        _a.label = 1;
                    case 1:
                        if (!(_i < statusNames_1.length)) return [3 /*break*/, 5];
                        name = statusNames_1[_i];
                        return [4 /*yield*/, this.statusRepository.findOneBy({ status: name })];
                    case 2:
                        existing = _a.sent();
                        if (!!existing) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.statusRepository.save({ status: name })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    VehiclesService.prototype.removeIndisponibleStatus = function () {
        return __awaiter(this, void 0, Promise, function () {
            var indisponibleStatus, defaultStatus, vehicles, _i, vehicles_1, vehicle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.statusRepository.findOneBy({
                            status: 'Indisponible'
                        })];
                    case 1:
                        indisponibleStatus = _a.sent();
                        if (!indisponibleStatus) return [3 /*break*/, 9];
                        return [4 /*yield*/, this.statusRepository.findOneBy({
                                status: 'Disponible'
                            })];
                    case 2:
                        defaultStatus = _a.sent();
                        if (!defaultStatus) {
                            throw new common_1.NotFoundException('Statut "Disponible" non trouvé pour la réaffectation.');
                        }
                        return [4 /*yield*/, this.vehiculeRepository.find({
                                where: { status: { id: indisponibleStatus.id } },
                                relations: ['status']
                            })];
                    case 3:
                        vehicles = _a.sent();
                        _i = 0, vehicles_1 = vehicles;
                        _a.label = 4;
                    case 4:
                        if (!(_i < vehicles_1.length)) return [3 /*break*/, 7];
                        vehicle = vehicles_1[_i];
                        vehicle.status = defaultStatus;
                        return [4 /*yield*/, this.vehiculeRepository.save(vehicle)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        _i++;
                        return [3 /*break*/, 4];
                    case 7: 
                    // Supprimer le statut "Indisponible"
                    return [4 /*yield*/, this.statusRepository.remove(indisponibleStatus)];
                    case 8:
                        // Supprimer le statut "Indisponible"
                        _a.sent();
                        _a.label = 9;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    VehiclesService.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculeRepository["delete"](id)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    VehiclesService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(vehicle_entity_1.Vehicule)),
        __param(1, typeorm_1.InjectRepository(type_entity_1.Type)),
        __param(2, typeorm_1.InjectRepository(status_entity_1.Status))
    ], VehiclesService);
    return VehiclesService;
}());
exports.VehiclesService = VehiclesService;
