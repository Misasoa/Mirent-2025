"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ReservationController = void 0;
var common_1 = require("@nestjs/common");
var ReservationController = /** @class */ (function () {
    function ReservationController(reservationService) {
        this.reservationService = reservationService;
    }
    ReservationController.prototype.findAll = function () {
        return this.reservationService.findAll();
    };
    ReservationController.prototype.createDevis = function (createReservationDto) {
        return this.reservationService.createDevis(createReservationDto);
    };
    ReservationController.prototype.confirmReservation = function (id) {
        return this.reservationService.confirmReservation(id);
    };
    ReservationController.prototype.completeReservation = function (id, completeReservationDto) {
        return this.reservationService.completeReservation(id, completeReservationDto.carburant_retour);
    };
    ReservationController.prototype.cancelReservation = function (id) {
        return this.reservationService.cancelReservation(id);
    };
    ReservationController.prototype.deleteReservation = function (id) {
        return this.reservationService.deleteReservation(id);
    };
    __decorate([
        common_1.Get()
    ], ReservationController.prototype, "findAll");
    __decorate([
        common_1.Post('devis'),
        common_1.UsePipes(new common_1.ValidationPipe()),
        __param(0, common_1.Body())
    ], ReservationController.prototype, "createDevis");
    __decorate([
        common_1.Patch(':id/confirm'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], ReservationController.prototype, "confirmReservation");
    __decorate([
        common_1.Patch(':id/complete'),
        common_1.UsePipes(new common_1.ValidationPipe()),
        __param(0, common_1.Param('id', common_1.ParseIntPipe)),
        __param(1, common_1.Body())
    ], ReservationController.prototype, "completeReservation");
    __decorate([
        common_1.Patch(':id/cancel'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], ReservationController.prototype, "cancelReservation");
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], ReservationController.prototype, "deleteReservation");
    ReservationController = __decorate([
        common_1.Controller('reservations')
    ], ReservationController);
    return ReservationController;
}());
exports.ReservationController = ReservationController;
