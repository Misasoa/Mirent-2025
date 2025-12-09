"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateRegionDto = void 0;
var class_validator_1 = require("class-validator");
var class_transformer_1 = require("class-transformer");
var CreatePrixDto = /** @class */ (function () {
    function CreatePrixDto() {
    }
    __decorate([
        class_validator_1.IsNumber()
    ], CreatePrixDto.prototype, "prix");
    return CreatePrixDto;
}());
var CreateRegionDto = /** @class */ (function () {
    function CreateRegionDto() {
    }
    __decorate([
        class_validator_1.IsString()
    ], CreateRegionDto.prototype, "nom_region");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString()
    ], CreateRegionDto.prototype, "nom_district");
    __decorate([
        class_validator_1.ValidateNested(),
        class_transformer_1.Type(function () { return CreatePrixDto; })
    ], CreateRegionDto.prototype, "prix");
    return CreateRegionDto;
}());
exports.CreateRegionDto = CreateRegionDto;
