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
exports.InvalidatedTokenService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var typeorm_2 = require("typeorm");
var invalidated_token_entity_1 = require("../entities/invalidated-token.entity");
var InvalidatedTokenService = /** @class */ (function () {
    function InvalidatedTokenService(invalidatedTokensRepository) {
        this.invalidatedTokensRepository = invalidatedTokensRepository;
    }
    /**
     * Invalide un jeton JWT en l'ajoutant à la liste noire.
     * @param token Le jeton JWT à invalider.
     * @param expiration La date et heure d'expiration du jeton original.
     * @returns Le jeton invalidé enregistré.
     */
    InvalidatedTokenService.prototype.invalidateToken = function (token, expiration) {
        return __awaiter(this, void 0, Promise, function () {
            var invalidatedToken, error_1, existingToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        invalidatedToken = this.invalidatedTokensRepository.create({
                            token: token,
                            expiration: expiration
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 6]);
                        return [4 /*yield*/, this.invalidatedTokensRepository.save(invalidatedToken)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        error_1 = _a.sent();
                        if (!(error_1.code === '23505' || error_1.message.includes('duplicate key'))) return [3 /*break*/, 5];
                        // PostgreSQL/TypeORM specific code for duplicate key
                        console.warn("Tentative d'invalider un jeton d\u00E9j\u00E0 sur liste noire : " + token.substring(0, 30) + "...");
                        return [4 /*yield*/, this.invalidatedTokensRepository.findOne({
                                where: { token: token }
                            })];
                    case 4:
                        existingToken = _a.sent();
                        if (!existingToken) {
                            throw new Error("Le jeton invalidé n'a pas pu être retrouvé.");
                        }
                        return [2 /*return*/, existingToken];
                    case 5: throw error_1;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Vérifie si un jeton JWT est présent dans la liste noire.
     * @param token Le jeton JWT à vérifier.
     * @returns Vrai si le token est sur la liste noire, faux sinon.
     */
    InvalidatedTokenService.prototype.isTokenInvalidated = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var found;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // Supprimez les tokens expirés avant de vérifier pour maintenir la table propre
                    // Note: Dans un environnement de production, cette opération devrait être
                    // exécutée périodiquement par un cron job ou un mécanisme de nettoyage asynchrone,
                    // pas à chaque vérification de token. Pour l'exemple, c'est inclus ici.
                    return [4 /*yield*/, this.cleanExpiredTokens()];
                    case 1:
                        // Supprimez les tokens expirés avant de vérifier pour maintenir la table propre
                        // Note: Dans un environnement de production, cette opération devrait être
                        // exécutée périodiquement par un cron job ou un mécanisme de nettoyage asynchrone,
                        // pas à chaque vérification de token. Pour l'exemple, c'est inclus ici.
                        _a.sent();
                        return [4 /*yield*/, this.invalidatedTokensRepository.findOne({
                                where: { token: token }
                            })];
                    case 2:
                        found = _a.sent();
                        return [2 /*return*/, !!found];
                }
            });
        });
    };
    /**
     * Supprime tous les jetons expirés de la liste noire.
     * Ceci aide à garder la base de données propre et performante.
     * Cette fonction devrait idéalement être appelée par un cron job régulier.
     */
    InvalidatedTokenService.prototype.cleanExpiredTokens = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.invalidatedTokensRepository["delete"]({
                            expiration: typeorm_2.LessThan(new Date())
                        })];
                    case 1:
                        _a.sent();
                        console.log('Tokens expirés nettoyés de la liste noire.');
                        return [2 /*return*/];
                }
            });
        });
    };
    InvalidatedTokenService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(invalidated_token_entity_1.InvalidatedToken))
    ], InvalidatedTokenService);
    return InvalidatedTokenService;
}());
exports.InvalidatedTokenService = InvalidatedTokenService;
