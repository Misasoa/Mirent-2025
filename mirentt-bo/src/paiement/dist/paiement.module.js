"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PaiementModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var paiement_entity_1 = require("../entities/paiement.entity");
var facture_entity_1 = require("../entities/facture.entity");
var paiement_service_1 = require("./paiement.service");
var paiement_controller_1 = require("./paiement.controller");
var commande_entity_1 = require("src/entities/commande.entity");
var PaiementModule = /** @class */ (function () {
    function PaiementModule() {
    }
    PaiementModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([paiement_entity_1.Paiement, facture_entity_1.Facture, commande_entity_1.BonDeCommande])],
            providers: [paiement_service_1.PaiementService],
            controllers: [paiement_controller_1.PaiementController],
            exports: [paiement_service_1.PaiementService]
        })
    ], PaiementModule);
    return PaiementModule;
}());
exports.PaiementModule = PaiementModule;
