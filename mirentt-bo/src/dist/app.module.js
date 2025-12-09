"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("./auth/auth.module");
var typeorm_1 = require("@nestjs/typeorm");
var database_config_1 = require("./config/database.config");
var serve_static_1 = require("@nestjs/serve-static");
var path_1 = require("path");
var vehicles_module_1 = require("./vehicles/vehicles.module");
var type_module_1 = require("./type/type.module");
var status_module_1 = require("./status/status.module");
var regions_module_1 = require("./regions/regions.module");
var prixs_module_1 = require("./prixs/prixs.module");
var client_module_1 = require("./client/client.module");
var proforma_module_1 = require("./proforma/proforma.module");
var mailer_module_1 = require("./mailer/mailer.module");
var devis_module_1 = require("./devis/devis.module");
var reservation_module_1 = require("./reservation/reservation.module");
var type_carburant_module_1 = require("./type-carburant/type-carburant.module");
var prix_carburant_module_1 = require("./prix-carburant/prix-carburant.module");
var vehicle_entity_1 = require("./entities/vehicle.entity");
var region_entity_1 = require("./entities/region.entity");
var status_entity_1 = require("./entities/status.entity");
var type_entity_1 = require("./entities/type.entity");
var prix_entity_1 = require("./entities/prix.entity");
var client_entity_1 = require("./entities/client.entity");
var proforma_entity_1 = require("./entities/proforma.entity");
var devis_entity_1 = require("./entities/devis.entity");
var proformat_item_entity_1 = require("./entities/proformat-item.entity");
var utilisateur_controller_1 = require("./utilisateur/utilisateur.controller");
var utilisateur_module_1 = require("./utilisateur/utilisateur.module");
var utilisateur_entity_1 = require("./entities/utilisateur.entity");
var notifications_module_1 = require("./notifications/notifications.module");
var schedule_1 = require("@nestjs/schedule");
var notifications_entity_1 = require("./entities/notifications.entity");
var commande_module_1 = require("./commande/commande.module");
var facturation_module_1 = require("./facturation/facturation.module");
var paiement_module_1 = require("./paiement/paiement.module");
var paiement_entity_1 = require("./entities/paiement.entity");
var facture_entity_1 = require("./entities/facture.entity");
var commande_entity_1 = require("./entities/commande.entity");
var carburant_price_entity_1 = require("./entities/carburant-price.entity");
var carburant_entity_1 = require("./entities/carburant.entity");
var district_entity_1 = require("./entities/district.entity");
var reservation_entity_1 = require("./entities/reservation.entity");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                schedule_1.ScheduleModule.forRoot(),
                typeorm_1.TypeOrmModule.forRoot(__assign(__assign({}, database_config_1.typeOrmConfig), { entities: [
                        reservation_entity_1.Reservation,
                        vehicle_entity_1.Vehicule,
                        region_entity_1.Region,
                        status_entity_1.Status,
                        type_entity_1.Type,
                        prix_entity_1.Prix,
                        client_entity_1.Client,
                        proforma_entity_1.Proforma,
                        proformat_item_entity_1.ProformaItem,
                        devis_entity_1.Devis,
                        utilisateur_entity_1.Utilisateur,
                        notifications_entity_1.Notification,
                        paiement_entity_1.Paiement,
                        facture_entity_1.Facture,
                        commande_entity_1.BonDeCommande,
                        carburant_price_entity_1.PrixCarburant,
                        carburant_entity_1.TypeCarburant,
                        district_entity_1.District,
                    ] })),
                auth_module_1.AuthModule,
                vehicles_module_1.VehiclesModule,
                type_module_1.TypeModule,
                status_module_1.StatusModule,
                regions_module_1.RegionsModule,
                client_module_1.ClientModule,
                serve_static_1.ServeStaticModule.forRoot({
                    rootPath: path_1.join(__dirname, '..', 'uploads'),
                    serveRoot: '/uploads'
                }),
                regions_module_1.RegionsModule,
                prixs_module_1.PrixsModule,
                proforma_module_1.ProformaModule,
                mailer_module_1.MailerModule,
                devis_module_1.DevisModule,
                reservation_module_1.ReservationModule,
                utilisateur_module_1.UtilisateurModule,
                notifications_module_1.NotificationsModule,
                commande_module_1.BonDeCommandeModule,
                facturation_module_1.FactureModule,
                paiement_module_1.PaiementModule,
                prix_carburant_module_1.PrixCarburantModule,
                type_carburant_module_1.TypeCarburantModule,
            ],
            controllers: [utilisateur_controller_1.UtilisateurController],
            providers: []
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
