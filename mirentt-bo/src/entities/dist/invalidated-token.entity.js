"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InvalidatedToken = void 0;
var typeorm_1 = require("typeorm");
/**
 * Entité représentant un jeton JWT invalidé (mis sur liste noire).
 * Un token est ajouté ici lorsqu'un utilisateur se déconnecte,
 * le rendant inutilisable même s'il n'est pas encore expiré.
 */
var InvalidatedToken = /** @class */ (function () {
    function InvalidatedToken() {
    }
    __decorate([
        typeorm_1.PrimaryColumn({ length: 500 }) // Longueur suffisante pour stocker le JWT
    ], InvalidatedToken.prototype, "token");
    __decorate([
        typeorm_1.Column({ type: 'timestamp' })
    ], InvalidatedToken.prototype, "expiration");
    InvalidatedToken = __decorate([
        typeorm_1.Entity('invalidated_tokens')
    ], InvalidatedToken);
    return InvalidatedToken;
}());
exports.InvalidatedToken = InvalidatedToken;
