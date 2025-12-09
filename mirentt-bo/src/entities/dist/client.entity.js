"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Client = void 0;
var typeorm_1 = require("typeorm");
var proforma_entity_1 = require("./proforma.entity");
var devis_entity_1 = require("./devis.entity");
var Client = /** @class */ (function () {
    function Client() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Client.prototype, "id");
    __decorate([
        typeorm_1.Column()
    ], Client.prototype, "lastName");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Client.prototype, "email");
    __decorate([
        typeorm_1.Column()
    ], Client.prototype, "phone");
    __decorate([
        typeorm_1.Column({ type: 'varchar', nullable: true })
    ], Client.prototype, "logo");
    __decorate([
        typeorm_1.OneToMany(function () { return proforma_entity_1.Proforma; }, function (proforma) { return proforma.client; })
    ], Client.prototype, "proformas");
    __decorate([
        typeorm_1.OneToMany(function () { return devis_entity_1.Devis; }, function (devis) { return devis.client; })
    ], Client.prototype, "devis");
    Client = __decorate([
        typeorm_1.Entity()
    ], Client);
    return Client;
}());
exports.Client = Client;
