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
exports.RegionService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var prix_entity_1 = require("src/entities/prix.entity");
var region_entity_1 = require("src/entities/region.entity");
var RegionService = /** @class */ (function () {
    function RegionService(regionRepository, prixRepository) {
        this.regionRepository = regionRepository;
        this.prixRepository = prixRepository;
    }
    RegionService.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.regionRepository.find({ relations: ['prix'] })];
            });
        });
    };
    RegionService.prototype.create = function (createRegionDto) {
        return __awaiter(this, void 0, Promise, function () {
            var region, prix, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        region = new region_entity_1.Region();
                        region.nom_region = createRegionDto.nom_region;
                        region.nom_district = createRegionDto.nom_district;
                        prix = this.prixRepository.create(createRegionDto.prix);
                        region.prix = prix;
                        console.log('Region received:', region);
                        console.log('Prix data:', region.prix);
                        console.log('Prix created:', prix);
                        return [4 /*yield*/, this.prixRepository.save(prix)];
                    case 1:
                        _a.sent();
                        region.prix = prix;
                        return [2 /*return*/, this.regionRepository.save(region)];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error creating region:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RegionService.prototype.updatePrix = function (regionId, prixValue) {
        return __awaiter(this, void 0, Promise, function () {
            var region, prix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.regionRepository.findOne({
                            where: { id: regionId },
                            relations: ['prix']
                        })];
                    case 1:
                        region = _a.sent();
                        if (!region) {
                            throw new Error('Region not found');
                        }
                        prix = region.prix;
                        if (!prix) {
                            prix = this.prixRepository.create({ prix: prixValue, region: region });
                        }
                        else {
                            prix.prix = prixValue;
                        }
                        return [2 /*return*/, this.prixRepository.save(prix)];
                }
            });
        });
    };
    RegionService.prototype.updateFull = function (regionId, updatedRegion) {
        return __awaiter(this, void 0, Promise, function () {
            var region, newPrix;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.regionRepository.findOne({
                            where: { id: regionId },
                            relations: ['prix']
                        })];
                    case 1:
                        region = _a.sent();
                        if (!region) {
                            throw new Error('Region not found');
                        }
                        if (updatedRegion.nom_region) {
                            region.nom_region = updatedRegion.nom_region;
                        }
                        if (updatedRegion.nom_district !== undefined) {
                            region.nom_district = updatedRegion.nom_district;
                        }
                        if (!(updatedRegion.prix && updatedRegion.prix.prix !== undefined)) return [3 /*break*/, 5];
                        if (!region.prix) return [3 /*break*/, 3];
                        region.prix.prix = updatedRegion.prix.prix;
                        return [4 /*yield*/, this.prixRepository.save(region.prix)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        newPrix = this.prixRepository.create({
                            prix: updatedRegion.prix.prix,
                            region: region
                        });
                        return [4 /*yield*/, this.prixRepository.save(newPrix)];
                    case 4:
                        _a.sent();
                        region.prix = newPrix;
                        _a.label = 5;
                    case 5: return [2 /*return*/, this.regionRepository.save(region)];
                }
            });
        });
    };
    RegionService.prototype.remove = function (regionId) {
        return __awaiter(this, void 0, Promise, function () {
            var region;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.regionRepository.findOne({
                            where: { id: regionId },
                            relations: ['prix']
                        })];
                    case 1:
                        region = _a.sent();
                        if (!region) {
                            throw new Error('Region not found');
                        }
                        if (!region.prix) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.prixRepository.remove(region.prix)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [4 /*yield*/, this.regionRepository.remove(region)];
                    case 4:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    /* async findByName(name: string): Promise<Region> {
      const region = await this.regionRepository.findOneBy({ nom_region: name });
      if (!region) {
        throw new NotFoundException(`Region '${name}' not found.`);
      }
      return region;
    }*/
    RegionService.prototype.findByName = function (regionName) {
        return __awaiter(this, void 0, Promise, function () {
            var region;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.regionRepository.findOne({
                            where: { nom_region: regionName },
                            relations: ['prix']
                        })];
                    case 1:
                        region = _a.sent();
                        console.log('Region loaded in findByName (should be in RegionService):', JSON.stringify(region, null, 2));
                        return [2 /*return*/, region !== null && region !== void 0 ? region : undefined];
                }
            });
        });
    };
    RegionService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(region_entity_1.Region)),
        __param(1, typeorm_1.InjectRepository(prix_entity_1.Prix))
    ], RegionService);
    return RegionService;
}());
exports.RegionService = RegionService;
