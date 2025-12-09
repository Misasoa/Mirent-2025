"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.PrixCarburant = void 0;
var typeorm_1 = require("typeorm");
var carburant_entity_1 = require("./carburant.entity");
var PrixCarburant = /** @class */ (function () {
    function PrixCarburant() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], PrixCarburant.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'decimal', precision: 10, scale: 2 })
    ], PrixCarburant.prototype, "prix_par_litre");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp with time zone' })
    ], PrixCarburant.prototype, "date_effective");
    __decorate([
        typeorm_1.OneToOne(function () { return carburant_entity_1.TypeCarburant; }),
        typeorm_1.JoinColumn({ name: 'type_carburant_id' })
    ], PrixCarburant.prototype, "typeCarburant");
    PrixCarburant = __decorate([
        typeorm_1.Entity()
    ], PrixCarburant);
    return PrixCarburant;
}());
exports.PrixCarburant = PrixCarburant;
