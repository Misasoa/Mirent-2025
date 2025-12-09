"use strict";
exports.__esModule = true;
exports.typeOrmConfig = void 0;
var dotenv = require("dotenv");
var blacklisted_token_entity_1 = require("../entities/blacklisted-token.entity");
var region_entity_1 = require("../entities/region.entity");
var status_entity_1 = require("../entities/status.entity");
var type_entity_1 = require("../entities/type.entity");
var vehicle_entity_1 = require("../entities/vehicle.entity");
var prix_entity_1 = require("src/entities/prix.entity");
var client_entity_1 = require("../entities/client.entity");
var proformat_item_entity_1 = require("src/entities/proformat-item.entity");
var proforma_entity_1 = require("src/entities/proforma.entity");
var devis_entity_1 = require("src/entities/devis.entity");
var reservation_entity_1 = require("src/entities/reservation.entity");
var utilisateur_entity_1 = require("src/entities/utilisateur.entity");
var notifications_entity_1 = require("src/entities/notifications.entity");
var facture_entity_1 = require("src/entities/facture.entity");
var paiement_entity_1 = require("src/entities/paiement.entity");
var commande_entity_1 = require("src/entities/commande.entity");
var carburant_price_entity_1 = require("src/entities/carburant-price.entity");
dotenv.config();
exports.typeOrmConfig = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [
        blacklisted_token_entity_1.BlacklistedToken,
        vehicle_entity_1.Vehicule,
        type_entity_1.Type,
        status_entity_1.Status,
        region_entity_1.Region,
        client_entity_1.Client,
        prix_entity_1.Prix,
        proformat_item_entity_1.ProformaItem,
        proforma_entity_1.Proforma,
        devis_entity_1.Devis,
        reservation_entity_1.Reservation,
        utilisateur_entity_1.Utilisateur,
        notifications_entity_1.Notification,
        facture_entity_1.Facture,
        paiement_entity_1.Paiement,
        commande_entity_1.BonDeCommande,
        carburant_price_entity_1.PrixCarburant,
    ],
    synchronize: true
};
