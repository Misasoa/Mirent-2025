"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PrixCarburantModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var prix_carburant_service_1 = require("./prix-carburant.service");
var prix_carburant_controller_1 = require("./prix-carburant.controller");
var carburant_price_entity_1 = require("../entities/carburant-price.entity");
var PrixCarburantModule = /** @class */ (function () {
    function PrixCarburantModule() {
    }
    PrixCarburantModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([carburant_price_entity_1.PrixCarburant])],
            controllers: [prix_carburant_controller_1.PrixCarburantController],
            providers: [prix_carburant_service_1.PrixCarburantService],
            exports: [prix_carburant_service_1.PrixCarburantService, typeorm_1.TypeOrmModule]
        })
    ], PrixCarburantModule);
    return PrixCarburantModule;
}());
exports.PrixCarburantModule = PrixCarburantModule;
