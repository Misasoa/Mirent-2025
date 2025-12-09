"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Devis = void 0;
var typeorm_1 = require("typeorm");
var client_entity_1 = require("./client.entity");
var Devis = /** @class */ (function () {
    function Devis() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn('uuid')
    ], Devis.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'jsonb', nullable: true })
    ], Devis.prototype, "items");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Devis.prototype, "startDate");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Devis.prototype, "endDate");
    __decorate([
        typeorm_1.Column({ "default": false })
    ], Devis.prototype, "includesFuel");
    __decorate([
        typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    ], Devis.prototype, "fuelCostPerDay");
    __decorate([
        typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2, "default": 0 })
    ], Devis.prototype, "totalAmount");
    __decorate([
        typeorm_1.Column({ "default": 'pending' })
    ], Devis.prototype, "status");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Devis.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], Devis.prototype, "updatedAt");
    __decorate([
        typeorm_1.ManyToOne(function () { return client_entity_1.Client; }, function (client) { return client.devis; })
    ], Devis.prototype, "client");
    __decorate([
        typeorm_1.Column()
    ], Devis.prototype, "clientId");
    Devis = __decorate([
        typeorm_1.Entity('devis')
    ], Devis);
    return Devis;
}());
exports.Devis = Devis;
