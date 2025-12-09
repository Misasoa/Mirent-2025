"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.RegionsModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var prix_entity_1 = require("src/entities/prix.entity");
var region_entity_1 = require("src/entities/region.entity");
var regions_service_1 = require("./regions.service");
var regions_controller_1 = require("./regions.controller");
var RegionsModule = /** @class */ (function () {
    function RegionsModule() {
    }
    RegionsModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([region_entity_1.Region, prix_entity_1.Prix])],
            controllers: [regions_controller_1.RegionController],
            providers: [regions_service_1.RegionService],
            exports: [regions_service_1.RegionService, typeorm_1.TypeOrmModule]
        })
    ], RegionsModule);
    return RegionsModule;
}());
exports.RegionsModule = RegionsModule;
