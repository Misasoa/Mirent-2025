"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ReservationModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var reservation_entity_1 = require("../entities/reservation.entity");
var reservation_service_1 = require("./reservation.service");
var reservation_controller_1 = require("./reservation.controller");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var client_entity_1 = require("src/entities/client.entity");
var district_entity_1 = require("src/entities/district.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var region_entity_1 = require("src/entities/region.entity");
var status_entity_1 = require("src/entities/status.entity");
var commande_entity_1 = require("src/entities/commande.entity");
var carburant_price_entity_1 = require("src/entities/carburant-price.entity");
var facture_entity_1 = require("src/entities/facture.entity");
var facturation_module_1 = require("src/facturation/facturation.module");
var ReservationModule = /** @class */ (function () {
    function ReservationModule() {
    }
    ReservationModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    reservation_entity_1.Reservation,
                    vehicle_entity_1.Vehicule,
                    client_entity_1.Client,
                    district_entity_1.District,
                    prix_entity_1.Prix,
                    region_entity_1.Region,
                    status_entity_1.Status,
                    commande_entity_1.BonDeCommande,
                    carburant_price_entity_1.PrixCarburant,
                    facture_entity_1.Facture,
                ]),
                facturation_module_1.FactureModule,
            ],
            providers: [reservation_service_1.ReservationService],
            controllers: [reservation_controller_1.ReservationController]
        })
    ], ReservationModule);
    return ReservationModule;
}());
exports.ReservationModule = ReservationModule;
