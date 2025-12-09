"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TypeCarburant = void 0;
var typeorm_1 = require("typeorm");
var TypeCarburant = /** @class */ (function () {
    function TypeCarburant() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], TypeCarburant.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 50, unique: true })
    ], TypeCarburant.prototype, "nom");
    TypeCarburant = __decorate([
        typeorm_1.Entity()
    ], TypeCarburant);
    return TypeCarburant;
}());
exports.TypeCarburant = TypeCarburant;
