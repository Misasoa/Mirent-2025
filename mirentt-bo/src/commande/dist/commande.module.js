"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BonDeCommandeModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var commande_entity_1 = require("src/entities/commande.entity");
var commande_service_1 = require("./commande.service");
var commande_controller_1 = require("./commande.controller");
var BonDeCommandeModule = /** @class */ (function () {
    function BonDeCommandeModule() {
    }
    BonDeCommandeModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([commande_entity_1.BonDeCommande])],
            providers: [commande_service_1.BonDeCommandeService],
            controllers: [commande_controller_1.BonDeCommandeController],
            exports: [commande_service_1.BonDeCommandeService]
        })
    ], BonDeCommandeModule);
    return BonDeCommandeModule;
}());
exports.BonDeCommandeModule = BonDeCommandeModule;
