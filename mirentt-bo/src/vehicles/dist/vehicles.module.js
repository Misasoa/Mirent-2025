"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.VehiclesModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var vehicles_controller_1 = require("./vehicles.controller");
var vehicles_service_1 = require("./vehicles.service");
var type_entity_1 = require("src/entities/type.entity");
var status_entity_1 = require("src/entities/status.entity");
var type_module_1 = require("src/type/type.module");
var VehiclesModule = /** @class */ (function () {
    function VehiclesModule() {
    }
    VehiclesModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.Vehicule, type_entity_1.Type, status_entity_1.Status]), type_module_1.TypeModule],
            controllers: [vehicles_controller_1.VehiclesController],
            providers: [vehicles_service_1.VehiclesService],
            exports: [vehicles_service_1.VehiclesService, typeorm_1.TypeOrmModule.forFeature([status_entity_1.Status])]
        })
    ], VehiclesModule);
    return VehiclesModule;
}());
exports.VehiclesModule = VehiclesModule;
