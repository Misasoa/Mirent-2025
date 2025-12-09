"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Status = void 0;
var typeorm_1 = require("typeorm");
var vehicle_entity_1 = require("./vehicle.entity");
var reservation_entity_1 = require("./reservation.entity");
var Status = /** @class */ (function () {
    function Status() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Status.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true, nullable: false })
    ], Status.prototype, "status");
    __decorate([
        typeorm_1.OneToMany(function () { return vehicle_entity_1.Vehicule; }, function (vehicule) { return vehicule.type; })
    ], Status.prototype, "vehiculesByType");
    __decorate([
        typeorm_1.OneToMany(function () { return vehicle_entity_1.Vehicule; }, function (vehicule) { return vehicule.status; })
    ], Status.prototype, "vehicules");
    __decorate([
        typeorm_1.ManyToOne(function () { return reservation_entity_1.Reservation; }, function (reservation) { return reservation.status; })
    ], Status.prototype, "reservation");
    Status = __decorate([
        typeorm_1.Entity()
    ], Status);
    return Status;
}());
exports.Status = Status;
