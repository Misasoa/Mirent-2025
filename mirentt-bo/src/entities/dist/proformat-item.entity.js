"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProformaItem = void 0;
// proforma-item.entity.ts
var typeorm_1 = require("typeorm");
var vehicle_entity_1 = require("./vehicle.entity");
var proforma_entity_1 = require("./proforma.entity");
var region_entity_1 = require("./region.entity");
var prix_entity_1 = require("./prix.entity");
var numeric_transformer_1 = require("../numeric.transformer");
var ProformaItem = /** @class */ (function () {
    function ProformaItem() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], ProformaItem.prototype, "id");
    __decorate([
        typeorm_1.ManyToOne(function () { return proforma_entity_1.Proforma; }, function (proforma) { return proforma.items; }),
        typeorm_1.JoinColumn({ name: 'proformaId' })
    ], ProformaItem.prototype, "proforma");
    __decorate([
        typeorm_1.ManyToOne(function () { return vehicle_entity_1.Vehicule; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'vehicleId' })
    ], ProformaItem.prototype, "vehicle");
    __decorate([
        typeorm_1.ManyToOne(function () { return region_entity_1.Region; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'regionId' })
    ], ProformaItem.prototype, "region");
    __decorate([
        typeorm_1.ManyToOne(function () { return prix_entity_1.Prix; }, { eager: true }),
        typeorm_1.JoinColumn({ name: 'prixId' })
    ], ProformaItem.prototype, "prix");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], ProformaItem.prototype, "dateDepart");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], ProformaItem.prototype, "dateRetour");
    __decorate([
        typeorm_1.Column({ type: 'integer' })
    ], ProformaItem.prototype, "nombreJours");
    __decorate([
        typeorm_1.Column('decimal', {
            precision: 10,
            scale: 2,
            "default": 0,
            transformer: new numeric_transformer_1.NumericTransformer()
        })
    ], ProformaItem.prototype, "subTotal");
    ProformaItem = __decorate([
        typeorm_1.Entity()
    ], ProformaItem);
    return ProformaItem;
}());
exports.ProformaItem = ProformaItem;
