"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UpdateProformaItemDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var UpdateProformaItemDto = /** @class */ (function () {
    function UpdateProformaItemDto() {
    }
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsInt()
    ], UpdateProformaItemDto.prototype, "clientId");
    __decorate([
        class_validator_1.IsOptional()
    ], UpdateProformaItemDto.prototype, "vehicleCriteria");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], UpdateProformaItemDto.prototype, "regionName");
    __decorate([
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return new Date(value);
        }),
        class_validator_1.IsDate()
    ], UpdateProformaItemDto.prototype, "dateDepart");
    __decorate([
        class_validator_1.IsOptional(),
        class_transformer_1.Transform(function (_a) {
            var value = _a.value;
            return new Date(value);
        }),
        class_validator_1.IsDate()
    ], UpdateProformaItemDto.prototype, "dateRetour");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsInt()
    ], UpdateProformaItemDto.prototype, "prixId");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsInt()
    ], UpdateProformaItemDto.prototype, "proformaId");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsInt(),
        class_validator_1.IsPositive()
    ], UpdateProformaItemDto.prototype, "nombreJours");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber(),
        class_validator_1.IsPositive()
    ], UpdateProformaItemDto.prototype, "subTotal");
    return UpdateProformaItemDto;
}());
exports.UpdateProformaItemDto = UpdateProformaItemDto;
