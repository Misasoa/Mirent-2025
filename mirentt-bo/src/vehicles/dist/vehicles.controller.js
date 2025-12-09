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
exports.VehiclesController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var VehiclesController = /** @class */ (function () {
    function VehiclesController(vehiculesService) {
        this.vehiculesService = vehiculesService;
        this.logger = new common_1.Logger(VehiclesController_1.name);
    }
    VehiclesController_1 = VehiclesController;
    VehiclesController.prototype.getAvailableVehiclesCount = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.vehiculesService.getAvailableVehiculeCount()];
            });
        });
    };
    VehiclesController.prototype.findAll = function () {
        return this.vehiculesService.findAll();
    };
    VehiclesController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var vehicle;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculesService.findOne(id)];
                    case 1:
                        vehicle = _a.sent();
                        if (!vehicle) {
                            throw new common_1.NotFoundException("Vehicle with ID " + id + " not found");
                        }
                        return [2 /*return*/, vehicle];
                }
            });
        });
    };
    VehiclesController.prototype.create = function (dto, file) {
        return __awaiter(this, void 0, Promise, function () {
            var baseUrl, imageUrl;
            return __generator(this, function (_a) {
                console.log('Fichier reçu :', file);
                baseUrl = process.env.API_BASE_URL || 'http://localhost:3000';
                imageUrl = baseUrl + "/uploads/" + file.filename;
                console.log('imageUrl:', imageUrl);
                return [2 /*return*/, this.vehiculesService.create(dto, imageUrl)];
            });
        });
    };
    VehiclesController.prototype.update = function (id, dto, file) {
        return __awaiter(this, void 0, Promise, function () {
            var imageUrl, updatedVehicule, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.logger.log("Requ\u00EAte PUT re\u00E7ue pour le v\u00E9hicule avec ID : " + id);
                        this.logger.log('Corps de la requête (DTO) : ', JSON.stringify(dto));
                        this.logger.log('Fichier de la requête (File) : ', JSON.stringify(file));
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        imageUrl = file
                            ? "http://localhost:3000/uploads/" + file.filename
                            : undefined;
                        this.logger.log("URL de l'image : ", imageUrl);
                        return [4 /*yield*/, this.vehiculesService.update(id, dto, imageUrl)];
                    case 2:
                        updatedVehicule = _a.sent();
                        this.logger.log('Véhicule mis à jour : ', JSON.stringify(updatedVehicule));
                        return [2 /*return*/, updatedVehicule];
                    case 3:
                        error_1 = _a.sent();
                        this.logger.error("Erreur lors de la mise \u00E0 jour du v\u00E9hicule avec ID " + id + " : ", error_1.stack);
                        throw new common_1.InternalServerErrorException('Internal server error');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    VehiclesController.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.vehiculesService.remove(id)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        throw new common_1.NotFoundException("Vehicle with ID " + id + " not found");
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    VehiclesController.prototype.updateStatus = function (id, statusName) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.vehiculesService.updateStatusByName(id, statusName)];
            });
        });
    };
    VehiclesController.prototype.updateStatusByName = function (id, statusName) {
        return __awaiter(this, void 0, Promise, function () {
            var vehicule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculesService.updateStatusByName(id, statusName)];
                    case 1:
                        vehicule = _a.sent();
                        if (!vehicule) {
                            throw new common_1.NotFoundException("Vehicle with ID " + id + " not found");
                        }
                        return [2 /*return*/, vehicule];
                }
            });
        });
    };
    VehiclesController.prototype.initStatuses = function () {
        return __awaiter(this, void 0, void 0, function () {
            var vehicules, updated, _i, vehicules_1, vehicule;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculesService.findAll()];
                    case 1:
                        vehicules = _a.sent();
                        updated = [];
                        _i = 0, vehicules_1 = vehicules;
                        _a.label = 2;
                    case 2:
                        if (!(_i < vehicules_1.length)) return [3 /*break*/, 9];
                        vehicule = vehicules_1[_i];
                        if (!(vehicule.status.status === 'Disponible')) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.vehiculesService.updateStatusByName(vehicule.id, 'Disponible')];
                    case 3:
                        _a.sent();
                        updated.push({ id: vehicule.id, status: 'Disponible' });
                        return [3 /*break*/, 8];
                    case 4:
                        if (!(vehicule.status.status === 'Maintenance')) return [3 /*break*/, 6];
                        return [4 /*yield*/, this.vehiculesService.updateStatusByName(vehicule.id, 'Maintenance')];
                    case 5:
                        _a.sent();
                        updated.push({ id: vehicule.id, status: 'Maintenance' });
                        return [3 /*break*/, 8];
                    case 6:
                        if (!(vehicule.status.status === 'Reserve')) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.vehiculesService.updateStatusByName(vehicule.id, 'Réservé')];
                    case 7:
                        _a.sent();
                        updated.push({ id: vehicule.id, status: 'Reserve' });
                        _a.label = 8;
                    case 8:
                        _i++;
                        return [3 /*break*/, 2];
                    case 9: return [2 /*return*/, {
                            message: 'Statuts mis à jour',
                            updated: updated
                        }];
                }
            });
        });
    };
    VehiclesController.prototype.createInitialStatuses = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculesService.initStatuses()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { message: 'Statuts initialisés avec succès ✅' }];
                }
            });
        });
    };
    VehiclesController.prototype.removeIndisponible = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.vehiculesService.removeIndisponibleStatus()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, {
                                message: 'Le statut "Indisponible" a été supprimé avec succès ✅'
                            }];
                }
            });
        });
    };
    var VehiclesController_1;
    __decorate([
        common_1.Get('available-count')
    ], VehiclesController.prototype, "getAvailableVehiclesCount");
    __decorate([
        common_1.Get()
    ], VehiclesController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], VehiclesController.prototype, "findOne");
    __decorate([
        common_1.Post(),
        common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.diskStorage({
                destination: './uploads',
                filename: function (req, file, callback) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, file.fieldname + "-" + uniqueSuffix + path_1.extname(file.originalname));
                }
            })
        })),
        __param(0, common_1.Body()),
        __param(1, common_1.UploadedFile())
    ], VehiclesController.prototype, "create");
    __decorate([
        common_1.Put(':id'),
        common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('image', {
            storage: multer_1.diskStorage({
                destination: './uploads',
                filename: function (req, file, callback) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, file.fieldname + "-" + uniqueSuffix + path_1.extname(file.originalname));
                }
            }),
            fileFilter: function (req, file, callback) {
                var allowedMimetypes = ['image/jpeg', 'image/png', 'image/jpg'];
                if (!allowedMimetypes.includes(file.mimetype)) {
                    return callback(new common_1.BadRequestException('Invalid file type'), false);
                }
                callback(null, true);
            }
        })),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __param(2, common_1.UploadedFile())
    ], VehiclesController.prototype, "update");
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], VehiclesController.prototype, "remove");
    __decorate([
        common_1.Patch(':id/status'),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body('status'))
    ], VehiclesController.prototype, "updateStatus");
    __decorate([
        common_1.Post(':id/status'),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body('status'))
    ], VehiclesController.prototype, "updateStatusByName");
    __decorate([
        common_1.Put('update-status')
    ], VehiclesController.prototype, "initStatuses");
    __decorate([
        common_1.Post('init-statuses')
    ], VehiclesController.prototype, "createInitialStatuses");
    __decorate([
        common_1.Delete('status/remove-indisponible')
    ], VehiclesController.prototype, "removeIndisponible");
    VehiclesController = VehiclesController_1 = __decorate([
        common_1.Controller('vehicles')
    ], VehiclesController);
    return VehiclesController;
}());
exports.VehiclesController = VehiclesController;
