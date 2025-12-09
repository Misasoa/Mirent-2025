"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Reservation = exports.CarburantPolicy = exports.ReservationStatus = void 0;
var typeorm_1 = require("typeorm");
var client_entity_1 = require("./client.entity");
var vehicle_entity_1 = require("./vehicle.entity");
var region_entity_1 = require("./region.entity");
var commande_entity_1 = require("./commande.entity");
var ReservationStatus;
(function (ReservationStatus) {
    ReservationStatus["DEVIS"] = "devis";
    ReservationStatus["CONFIRMEE"] = "confirmee";
    ReservationStatus["ANNULEE"] = "annulee";
    ReservationStatus["TERMINEE"] = "terminee";
})(ReservationStatus = exports.ReservationStatus || (exports.ReservationStatus = {}));
var CarburantPolicy;
(function (CarburantPolicy) {
    CarburantPolicy["PLEIN_A_PLEIN"] = "plein_a_plein";
    CarburantPolicy["PAY_AS_YOU_USE"] = "pay_as_you_use";
})(CarburantPolicy = exports.CarburantPolicy || (exports.CarburantPolicy = {}));
var Reservation = /** @class */ (function () {
    function Reservation() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Reservation.prototype, "id");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 20, unique: true })
    ], Reservation.prototype, "reference");
    __decorate([
        typeorm_1.Column({ type: 'timestamp', "default": function () { return 'CURRENT_TIMESTAMP'; } })
    ], Reservation.prototype, "createdAt");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Reservation.prototype, "pickup_date");
    __decorate([
        typeorm_1.Column({ type: 'date' })
    ], Reservation.prototype, "return_date");
    __decorate([
        typeorm_1.Column('decimal', { precision: 10, scale: 2 })
    ], Reservation.prototype, "total_price");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": ReservationStatus,
            "default": ReservationStatus.DEVIS
        })
    ], Reservation.prototype, "status");
    __decorate([
        typeorm_1.ManyToOne(function () { return client_entity_1.Client; }, { onDelete: 'CASCADE' }),
        typeorm_1.JoinColumn({ name: 'client_id' })
    ], Reservation.prototype, "client");
    __decorate([
        typeorm_1.ManyToOne(function () { return vehicle_entity_1.Vehicule; }, { onDelete: 'SET NULL' }),
        typeorm_1.JoinColumn({ name: 'vehicule_id' })
    ], Reservation.prototype, "vehicule");
    __decorate([
        typeorm_1.ManyToOne(function () { return region_entity_1.Region; }, { onDelete: 'SET NULL' }),
        typeorm_1.JoinColumn({ name: 'region_id' })
    ], Reservation.prototype, "location");
    __decorate([
        typeorm_1.Column({ type: 'int', nullable: false })
    ], Reservation.prototype, "nombreJours");
    __decorate([
        typeorm_1.CreateDateColumn({ type: 'timestamp with time zone' })
    ], Reservation.prototype, "created_at");
    __decorate([
        typeorm_1.UpdateDateColumn({ type: 'timestamp with time zone' })
    ], Reservation.prototype, "updated_at");
    __decorate([
        typeorm_1.Column({ type: 'varchar', length: 255, nullable: true })
    ], Reservation.prototype, "note");
    __decorate([
        typeorm_1.Column({
            type: 'enum',
            "enum": CarburantPolicy,
            "default": CarburantPolicy.PLEIN_A_PLEIN
        })
    ], Reservation.prototype, "carburant_policy");
    __decorate([
        typeorm_1.Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    ], Reservation.prototype, "carburant_depart");
    __decorate([
        typeorm_1.Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    ], Reservation.prototype, "carburant_retour");
    __decorate([
        typeorm_1.Column({ type: 'int', nullable: true })
    ], Reservation.prototype, "kilometrage_depart");
    __decorate([
        typeorm_1.Column({ type: 'int', nullable: true })
    ], Reservation.prototype, "kilometrage_retour");
    __decorate([
        typeorm_1.OneToOne(function () { return commande_entity_1.BonDeCommande; }, function (bdc) { return bdc.reservation; })
    ], Reservation.prototype, "bonDeCommande");
    Reservation = __decorate([
        typeorm_1.Entity()
    ], Reservation);
    return Reservation;
}());
exports.Reservation = Reservation;
