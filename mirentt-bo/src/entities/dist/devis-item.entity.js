"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.DevisItem = void 0;
var typeorm_1 = require("typeorm");
var vehicle_entity_1 = require("./vehicle.entity");
var devis_entity_1 = require("./devis.entity");
var region_entity_1 = require("./region.entity");
var prix_entity_1 = require("./prix.entity");
var DevisItem = /** @class */ (function () {
    function DevisItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], DevisItem.prototype, "id");
    __decorate([
        typeorm_1.ManyToOne(function () { return devis_entity_1.Devis; }, function (devis) { return devis.items; }),
        typeorm_1.JoinColumn({ name: 'devisId' })
    ], DevisItem.prototype, "devis");
    __decorate([
        typeorm_1.ManyToOne(function () { return vehicle_entity_1.Vehicule; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'vehicleId' })
    ], DevisItem.prototype, "vehicule");
    __decorate([
        typeorm_1.ManyToOne(function () { return region_entity_1.Region; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'regionId' })
    ], DevisItem.prototype, "region");
    __decorate([
        typeorm_1.ManyToOne(function () { return prix_entity_1.Prix; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'prixId' })
    ], DevisItem.prototype, "prix");
    __decorate([
        typeorm_1.Column()
    ], DevisItem.prototype, "dateDebut");
    __decorate([
        typeorm_1.Column()
    ], DevisItem.prototype, "dateFin");
    __decorate([
        typeorm_1.Column()
    ], DevisItem.prototype, "nombreJours");
    __decorate([
        typeorm_1.Column()
    ], DevisItem.prototype, "prixCarburant");
    __decorate([
        typeorm_1.Column({ type: 'decimal' })
    ], DevisItem.prototype, "sousTotal");
    DevisItem = __decorate([
        typeorm_1.Entity()
    ], DevisItem);
    return DevisItem;
}());
exports.DevisItem = DevisItem;
