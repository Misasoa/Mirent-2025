"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Proforma = exports.ProformaStatus = void 0;
var typeorm_1 = require("typeorm");
var client_entity_1 = require("./client.entity");
var proformat_item_entity_1 = require("./proformat-item.entity");
var numeric_transformer_1 = require("../numeric.transformer"); // Vérifie le chemin du fichier
var ProformaStatus;
(function (ProformaStatus) {
    ProformaStatus["BROUILLON"] = "Brouillon";
    ProformaStatus["ENVOYEE"] = "Envoy\u00E9e";
    ProformaStatus["CONFIRMEE"] = "Confirm\u00E9e";
    ProformaStatus["ANNULEE"] = "Annul\u00E9e";
})(ProformaStatus = exports.ProformaStatus || (exports.ProformaStatus = {}));
var Proforma = /** @class */ (function () {
    function Proforma() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Proforma.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Proforma.prototype, "proformaNumber");
    __decorate([
        typeorm_1.ManyToOne(function () { return client_entity_1.Client; }, function (client) { return client.proformas; }, {
            eager: true,
            onDelete: 'CASCADE'
        })
    ], Proforma.prototype, "client");
    __decorate([
        typeorm_1.Column()
    ], Proforma.prototype, "date");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Proforma.prototype, "contractReference");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Proforma.prototype, "notes");
    __decorate([
        typeorm_1.OneToMany(function () { return proformat_item_entity_1.ProformaItem; }, function (item) { return item.proforma; }, {
            eager: true,
            cascade: true
        })
    ], Proforma.prototype, "items");
    __decorate([
        typeorm_1.Column('decimal', {
            precision: 10,
            scale: 2,
            "default": 0,
            transformer: new numeric_transformer_1.NumericTransformer()
        })
    ], Proforma.prototype, "totalAmount");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": ProformaStatus,
            "default": ProformaStatus.BROUILLON
        })
    ], Proforma.prototype, "status");
    __decorate([
        typeorm_1.CreateDateColumn()
    ], Proforma.prototype, "createdAt");
    __decorate([
        typeorm_1.UpdateDateColumn()
    ], Proforma.prototype, "updatedAt");
    Proforma = __decorate([
        typeorm_1.Entity()
    ], Proforma);
    return Proforma;
}());
exports.Proforma = Proforma;
