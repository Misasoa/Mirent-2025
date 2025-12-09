"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.UtilisateurController = void 0;
var common_1 = require("@nestjs/common");
var utilisateur_jwt_auth_guard_1 = require("../utilisateur/utilisateur.jwt-auth.guard"); // Assurez-vous que le chemin est correct
var swagger_1 = require("@nestjs/swagger"); // Pour Swagger
var UtilisateurController = /** @class */ (function () {
    function UtilisateurController(utilisateurService) {
        this.utilisateurService = utilisateurService;
    }
    /**
     * Enregistre un nouvel utilisateur dans le système.
     * @param createUserDto Les données d'enregistrement de l'utilisateur.
     * @returns L'utilisateur enregistré (sans le mot de passe hashé).
     */
    UtilisateurController.prototype.register = function (createUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.utilisateurService.register(createUserDto)];
            });
        });
    };
    /**
     * Connecte un utilisateur et lui retourne un jeton JWT.
     * @param loginUserDto Les identifiants de connexion de l'utilisateur (email et mot de passe).
     * @returns Un objet contenant le jeton d'accès et les informations de l'utilisateur.
     */
    UtilisateurController.prototype.login = function (loginUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.utilisateurService.login(loginUserDto)];
            });
        });
    };
    /**
     * Déconnecte un utilisateur en invalidant son jeton JWT actuel.
     * Nécessite un jeton JWT valide dans les en-têtes d'autorisation (Bearer Token).
     * Le jeton est ajouté à une liste noire côté serveur.
     * @param req L'objet de requête HTTP, utilisé pour extraire le jeton.
     * @returns Un message de confirmation de déconnexion.
     */
    UtilisateurController.prototype.logout = function (req) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var token;
            return __generator(this, function (_b) {
                token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!token) {
                    throw new common_1.UnauthorizedException("Jeton d'authentification manquant.");
                }
                return [2 /*return*/, this.utilisateurService.logout(token)];
            });
        });
    };
    __decorate([
        common_1.Post('register'),
        common_1.HttpCode(common_1.HttpStatus.CREATED) // Retourne un statut 201 Created
        ,
        swagger_1.ApiResponse({
            status: 201,
            description: "L'utilisateur a été enregistré avec succès."
        }),
        swagger_1.ApiResponse({
            status: 400,
            description: 'Mots de passe non correspondants.'
        }),
        swagger_1.ApiResponse({
            status: 409,
            description: 'Un utilisateur avec cet email existe déjà.'
        }),
        __param(0, common_1.Body())
    ], UtilisateurController.prototype, "register");
    __decorate([
        common_1.Post('login'),
        common_1.HttpCode(common_1.HttpStatus.OK) // Retourne un statut 200 OK
        ,
        swagger_1.ApiResponse({
            status: 200,
            description: "Connexion réussie. Retourne le jeton d'accès et les informations utilisateur."
        }),
        swagger_1.ApiResponse({ status: 401, description: 'Email ou mot de passe incorrect.' }),
        __param(0, common_1.Body())
    ], UtilisateurController.prototype, "login");
    __decorate([
        swagger_1.ApiBearerAuth() // Indique que cette route nécessite un jeton Bearer pour Swagger
        ,
        common_1.UseGuards(utilisateur_jwt_auth_guard_1.JwtAuthGuard) // Protège cette route, l'utilisateur doit être connecté et son token validé
        ,
        common_1.Post('logout'),
        common_1.HttpCode(common_1.HttpStatus.OK) // Retourne un statut 200 OK
        ,
        swagger_1.ApiResponse({ status: 200, description: 'Déconnexion réussie.' }),
        swagger_1.ApiResponse({
            status: 400,
            description: 'Jeton invalide ou impossible de déconnecter.'
        }),
        swagger_1.ApiResponse({
            status: 401,
            description: 'Non autorisé (jeton manquant, invalide ou sur liste noire).'
        }),
        __param(0, common_1.Request())
    ], UtilisateurController.prototype, "logout");
    UtilisateurController = __decorate([
        swagger_1.ApiTags('Utilisateurs') // Catégorise les routes pour la documentation Swagger
        ,
        common_1.Controller('utilisateur')
    ], UtilisateurController);
    return UtilisateurController;
}());
exports.UtilisateurController = UtilisateurController;
