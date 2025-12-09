"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Facture = void 0;
var typeorm_1 = require("typeorm");
var paiement_entity_1 = require("./paiement.entity");
var commande_entity_1 = require("./commande.entity");
var Facture = /** @class */ (function () {
    function Facture() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Facture.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Facture.prototype, "numero");
    __decorate([
        typeorm_1.ManyToOne(function () { return commande_entity_1.BonDeCommande; }, function (bdc) { return bdc.facture; }, { onDelete: 'CASCADE' })
    ], Facture.prototype, "bdc");
    __decorate([
        typeorm_1.OneToMany(function () { return paiement_entity_1.Paiement; }, function (paiement) { return paiement.facture; })
    ], Facture.prototype, "paiements");
    __decorate([
        typeorm_1.Column('decimal', { precision: 10, scale: 2 })
    ], Facture.prototype, "montant");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Facture.prototype, "date_facture");
    Facture = __decorate([
        typeorm_1.Entity()
    ], Facture);
    return Facture;
}());
exports.Facture = Facture;
