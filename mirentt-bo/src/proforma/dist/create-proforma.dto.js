"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateProformaDto = void 0;
var class_validator_1 = require("class-validator");
var CreateProformaDto = /** @class */ (function () {
    function CreateProformaDto() {
    }
    __decorate([
        class_validator_1.IsArray(),
        class_validator_1.IsNotEmpty()
    ], CreateProformaDto.prototype, "items");
    __decorate([
        class_validator_1.IsString()
    ], CreateProformaDto.prototype, "proformaNumber");
    __decorate([
        class_validator_1.IsDateString()
    ], CreateProformaDto.prototype, "date");
    __decorate([
        class_validator_1.IsNumber()
    ], CreateProformaDto.prototype, "totalAmount");
    __decorate([
        class_validator_1.IsNumber()
    ], CreateProformaDto.prototype, "clientId");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateProformaDto.prototype, "status");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateProformaDto.prototype, "contractReference");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateProformaDto.prototype, "notes");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateProformaDto.prototype, "createdAt");
    __decorate([
        class_validator_1.IsString(),
        class_validator_1.IsOptional()
    ], CreateProformaDto.prototype, "updatedAt");
    return CreateProformaDto;
}());
exports.CreateProformaDto = CreateProformaDto;
