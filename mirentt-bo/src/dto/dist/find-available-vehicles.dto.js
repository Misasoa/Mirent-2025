"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.FindAvailableVehiclesDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var FindAvailableVehiclesDto = /** @class */ (function () {
    function FindAvailableVehiclesDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], FindAvailableVehiclesDto.prototype, "marque");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], FindAvailableVehiclesDto.prototype, "modele");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], FindAvailableVehiclesDto.prototype, "type");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_transformer_1.Type(function () { return Date; }),
        class_validator_1.IsDate()
    ], FindAvailableVehiclesDto.prototype, "dateDepart");
    __decorate([
        class_validator_1.IsNotEmpty(),
        class_transformer_1.Type(function () { return Date; }),
        class_validator_1.IsDate()
    ], FindAvailableVehiclesDto.prototype, "dateRetour");
    return FindAvailableVehiclesDto;
}());
exports.FindAvailableVehiclesDto = FindAvailableVehiclesDto;
