"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TypeCarburantModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var type_carburant_service_1 = require("./type-carburant.service");
var type_carburant_controller_1 = require("./type-carburant.controller");
var carburant_entity_1 = require("../entities/carburant.entity");
var TypeCarburantModule = /** @class */ (function () {
    function TypeCarburantModule() {
    }
    TypeCarburantModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([carburant_entity_1.TypeCarburant])],
            controllers: [type_carburant_controller_1.TypeCarburantController],
            providers: [type_carburant_service_1.TypeCarburantService],
            exports: [type_carburant_service_1.TypeCarburantService, typeorm_1.TypeOrmModule]
        })
    ], TypeCarburantModule);
    return TypeCarburantModule;
}());
exports.TypeCarburantModule = TypeCarburantModule;
