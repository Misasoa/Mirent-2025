"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Reservation = void 0;
var typeorm_1 = require("typeorm");
var region_entity_1 = require("./region.entity");
var vehicle_entity_1 = require("./vehicle.entity");
var reservation_status_enum_1 = require("src/reservation/Enum/reservation-status.enum");
var utilisateur_entity_1 = require("./utilisateur.entity"); // <-- Add this import
var Reservation = /** @class */ (function () {
    function Reservation() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Reservation.prototype, "id");
    __decorate([
        typeorm_1.Column('date')
    ], Reservation.prototype, "startDate");
    __decorate([
        typeorm_1.Column('date')
    ], Reservation.prototype, "endDate");
    __decorate([
        typeorm_1.Column()
    ], Reservation.prototype, "fullName");
    __decorate([
        typeorm_1.Column()
    ], Reservation.prototype, "phone");
    __decorate([
        typeorm_1.Column()
    ], Reservation.prototype, "email");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": reservation_status_enum_1.ReservationStatus,
            "default": reservation_status_enum_1.ReservationStatus.UPCOMING
        })
    ], Reservation.prototype, "status");
    __decorate([
        typeorm_1.Column('decimal')
    ], Reservation.prototype, "totalPrice");
    __decorate([
        typeorm_1.ManyToOne(function () { return vehicle_entity_1.Vehicule; }, function (vehicle) { return vehicle.reservations; })
    ], Reservation.prototype, "vehicle");
    __decorate([
        typeorm_1.Column()
    ], Reservation.prototype, "vehicleId");
    __decorate([
        typeorm_1.ManyToOne(function () { return region_entity_1.Region; })
    ], Reservation.prototype, "pickupRegion");
    __decorate([
        typeorm_1.Column()
    ], Reservation.prototype, "pickupRegionId");
    __decorate([
        typeorm_1.ManyToOne(function () { return utilisateur_entity_1.Utilisateur; }, function (utilisateur) { return utilisateur.reservations; }) // <-- Add this relationship
    ], Reservation.prototype, "utilisateur");
    __decorate([
        typeorm_1.Column() // <-- Add this foreign key column, assuming it's a number
    ], Reservation.prototype, "userId");
    Reservation = __decorate([
        typeorm_1.Entity()
    ], Reservation);
    return Reservation;
}());
exports.Reservation = Reservation;
