"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.UtilisateurModule = void 0;
var common_1 = require("@nestjs/common");
var utilisateur_service_1 = require("./utilisateur.service");
var utilisateur_entity_1 = require("src/entities/utilisateur.entity");
var utilisateur_controller_1 = require("./utilisateur.controller");
var typeorm_1 = require("@nestjs/typeorm");
var jwt_1 = require("@nestjs/jwt");
var constants_1 = require("./constants");
var invalidated_token_service_1 = require("./invalidated-token.service"); // Importez le nouveau service
var invalidated_token_entity_1 = require("../entities/invalidated-token.entity"); // Importez la nouvelle entité
var passport_1 = require("@nestjs/passport");
var jwt_stratezgy_1 = require("../utilisateur/jwt.stratezgy");
var UtilisateurModule = /** @class */ (function () {
    function UtilisateurModule() {
    }
    UtilisateurModule = __decorate([
        common_1.Module({
            imports: [
                typeorm_1.TypeOrmModule.forFeature([utilisateur_entity_1.Utilisateur, invalidated_token_entity_1.InvalidatedToken]),
                passport_1.PassportModule,
                jwt_1.JwtModule.register({
                    secret: constants_1.jwtConstants.secret,
                    signOptions: { expiresIn: '60m' }
                }),
            ],
            controllers: [utilisateur_controller_1.UtilisateurController],
            providers: [utilisateur_service_1.UtilisateurService, invalidated_token_service_1.InvalidatedTokenService, jwt_stratezgy_1.JwtStrategy],
            exports: [utilisateur_service_1.UtilisateurService, jwt_1.JwtModule, invalidated_token_service_1.InvalidatedTokenService]
        })
    ], UtilisateurModule);
    return UtilisateurModule;
}());
exports.UtilisateurModule = UtilisateurModule;
