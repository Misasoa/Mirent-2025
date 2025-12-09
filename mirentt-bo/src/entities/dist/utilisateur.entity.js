"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Utilisateur = exports.UserRole = void 0;
var typeorm_1 = require("typeorm");
var reservation_entity_1 = require("./reservation.entity");
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CLIENT"] = "client";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var Utilisateur = /** @class */ (function () {
    function Utilisateur() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn()
    ], Utilisateur.prototype, "id");
    __decorate([
        typeorm_1.Column({ unique: true })
    ], Utilisateur.prototype, "email");
    __decorate([
        typeorm_1.Column()
    ], Utilisateur.prototype, "firstName");
    __decorate([
        typeorm_1.Column()
    ], Utilisateur.prototype, "lastName");
    __decorate([
        typeorm_1.Column()
    ], Utilisateur.prototype, "passwordHash");
    __decorate([
        typeorm_1.Column({ type: 'enum', "enum": UserRole, "default": UserRole.CLIENT })
    ], Utilisateur.prototype, "role");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Utilisateur.prototype, "fullName");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Utilisateur.prototype, "phone");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Utilisateur.prototype, "address");
    __decorate([
        typeorm_1.Column({ nullable: true })
    ], Utilisateur.prototype, "profilePicture");
    __decorate([
        typeorm_1.OneToMany(function () { return reservation_entity_1.Reservation; }, function (reservation) { return reservation.client; })
    ], Utilisateur.prototype, "reservations");
    Utilisateur = __decorate([
        typeorm_1.Entity()
    ], Utilisateur);
    return Utilisateur;
}());
exports.Utilisateur = Utilisateur;
