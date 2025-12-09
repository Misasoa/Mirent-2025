"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateReservationDto = void 0;
var class_validator_1 = require("class-validator");
var reservation_entity_1 = require("src/entities/reservation.entity");
var CreateReservationDto = /** @class */ (function () {
    function CreateReservationDto() {
    }
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "clientId");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "vehiculeId");
    __decorate([
        class_validator_1.IsDateString(),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "pickup_date");
    __decorate([
        class_validator_1.IsDateString(),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "return_date");
    __decorate([
        class_validator_1.IsInt(),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "region_id");
    __decorate([
        class_validator_1.IsEnum(reservation_entity_1.CarburantPolicy),
        class_validator_1.IsNotEmpty()
    ], CreateReservationDto.prototype, "carburant_policy");
    __decorate([
        class_validator_1.IsOptional()
    ], CreateReservationDto.prototype, "carburant_depart");
    __decorate([
        class_validator_1.IsOptional()
    ], CreateReservationDto.prototype, "carburant_retour");
    __decorate([
        class_validator_1.IsOptional()
    ], CreateReservationDto.prototype, "kilometrage_depart");
    __decorate([
        class_validator_1.IsOptional()
    ], CreateReservationDto.prototype, "kilometrage_retour");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber()
    ], CreateReservationDto.prototype, "prix_par_litre");
    return CreateReservationDto;
}());
exports.CreateReservationDto = CreateReservationDto;
