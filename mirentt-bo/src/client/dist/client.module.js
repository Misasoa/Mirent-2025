"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ClientModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var client_controller_1 = require("./client.controller");
var client_service_1 = require("./client.service");
var client_entity_1 = require("src/entities/client.entity");
var proforma_module_1 = require("src/proforma/proforma.module");
var ClientModule = /** @class */ (function () {
    function ClientModule() {
    }
    ClientModule = __decorate([
        common_1.Module({
            imports: [typeorm_1.TypeOrmModule.forFeature([client_entity_1.Client]), proforma_module_1.ProformaModule],
            controllers: [client_controller_1.ClientController],
            providers: [client_service_1.ClientService],
            exports: [client_service_1.ClientService, typeorm_1.TypeOrmModule]
        })
    ], ClientModule);
    return ClientModule;
}());
exports.ClientModule = ClientModule;
