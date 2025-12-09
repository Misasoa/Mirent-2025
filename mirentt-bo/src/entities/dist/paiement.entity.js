"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Paiement = exports.PaymentMethod = void 0;
var typeorm_1 = require("typeorm");
var commande_entity_1 = require("./commande.entity");
var facture_entity_1 = require("./facture.entity");
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["ESPECES"] = "especes";
    PaymentMethod["MOBILE_MONEY"] = "mobile_money";
    PaymentMethod["CARTE_BANCAIRE"] = "carte_bancaire";
})(PaymentMethod = exports.PaymentMethod || (exports.PaymentMethod = {}));
var Paiement = /** @class */ (function () {
    function Paiement() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Paiement.prototype, "id");
    __decorate([
        typeorm_1.Column('decimal', { precision: 10, scale: 2 })
    ], Paiement.prototype, "montant");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": PaymentMethod
        })
    ], Paiement.prototype, "methode");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 255, nullable: true })
    ], Paiement.prototype, "reference_transaction");
    __decorate([
        typeorm_1.ManyToOne(function () { return commande_entity_1.BonDeCommande; }, function (bdc) { return bdc.paiements; }, {
            onDelete: 'CASCADE'
        })
    ], Paiement.prototype, "bdc");
    __decorate([
        typeorm_1.ManyToOne(function () { return facture_entity_1.Facture; }, function (facture) { return facture.paiements; })
    ], Paiement.prototype, "facture");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Paiement.prototype, "date_paiement");
    Paiement = __decorate([
        typeorm_1.Entity()
    ], Paiement);
    return Paiement;
}());
exports.Paiement = Paiement;
