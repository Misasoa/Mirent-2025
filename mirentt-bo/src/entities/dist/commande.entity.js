"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BonDeCommande = void 0;
var typeorm_1 = require("typeorm");
var reservation_entity_1 = require("./reservation.entity");
var paiement_entity_1 = require("./paiement.entity");
var facture_entity_1 = require("./facture.entity");
var BonDeCommande = /** @class */ (function () {
    function BonDeCommande() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], BonDeCommande.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 20, unique: true })
    ], BonDeCommande.prototype, "reference");
    __decorate([
        typeorm_1.OneToOne(function () { return reservation_entity_1.Reservation; }, function (reservation) { return reservation.bonDeCommande; }, {
            onDelete: 'CASCADE'
        }),
        typeorm_1.JoinColumn()
    ], BonDeCommande.prototype, "reservation");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp with time zone' })
    ], BonDeCommande.prototype, "created_at");
    __decorate([
        typeorm_1.OneToMany(function () { return paiement_entity_1.Paiement; }, function (paiement) { return paiement.bdc; })
    ], BonDeCommande.prototype, "paiements");
    __decorate([
        typeorm_1.OneToOne(function () { return facture_entity_1.Facture; }, function (factures) { return factures.bdc; })
    ], BonDeCommande.prototype, "facture");
    BonDeCommande = __decorate([
        typeorm_1.Entity()
    ], BonDeCommande);
    return BonDeCommande;
}());
exports.BonDeCommande = BonDeCommande;
