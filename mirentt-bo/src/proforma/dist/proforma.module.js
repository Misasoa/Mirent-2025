"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProformaModule = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var proforma_entity_1 = require("src/entities/proforma.entity");
var proformat_item_entity_1 = require("src/entities/proformat-item.entity");
var proforma_service_1 = require("./proforma.service");
var proforma_controller_1 = require("./proforma.controller");
var vehicle_entity_1 = require("src/entities/vehicle.entity");
var region_entity_1 = require("src/entities/region.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var status_entity_1 = require("src/entities/status.entity");
var client_entity_1 = require("src/entities/client.entity");
var type_entity_1 = require("src/entities/type.entity");
var mailer_service_1 = require("src/mailer/mailer.service");
var pdf_service_1 = require("src/pdf/pdf.service");
var ProformaModule = /** @class */ (function () {
    function ProformaModule() {
    }
    ProformaModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([
                    proforma_entity_1.Proforma,
                    proformat_item_entity_1.ProformaItem,
                    vehicle_entity_1.Vehicule,
                    region_entity_1.Region,
                    prix_entity_1.Prix,
                    status_entity_1.Status,
                    client_entity_1.Client,
                    type_entity_1.Type,
                ]),
            ],
            providers: [proforma_service_1.ProformaService, mailer_service_1.MailService, pdf_service_1.PdfService],
            controllers: [proforma_controller_1.ProformaController],
            exports: [proforma_service_1.ProformaService]
        })
    ], ProformaModule);
    return ProformaModule;
}());
exports.ProformaModule = ProformaModule;
