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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.UtilisateurService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var bcrypt = require("bcrypt");
var utilisateur_entity_1 = require("../entities/utilisateur.entity");
var UtilisateurService = /** @class */ (function () {
    function UtilisateurService(usersRepository, jwtService, invalidatedTokenService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.invalidatedTokenService = invalidatedTokenService;
    }
    UtilisateurService.prototype.register = function (createUserDto) {
        return __awaiter(this, void 0, Promise, function () {
            var firstName, lastName, email, password, confirmPassword, existingUser, saltRounds, passwordHash, newUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        firstName = createUserDto.firstName, lastName = createUserDto.lastName, email = createUserDto.email, password = createUserDto.password, confirmPassword = createUserDto.confirmPassword;
                        if (password !== confirmPassword) {
                            throw new common_1.BadRequestException('Les mots de passe ne correspondent pas.');
                        }
                        return [4 /*yield*/, this.usersRepository.findOne({
                                where: { email: email }
                            })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà.');
                        }
                        saltRounds = 10;
                        return [4 /*yield*/, bcrypt.hash(password, saltRounds)];
                    case 2:
                        passwordHash = _a.sent();
                        newUser = this.usersRepository.create({
                            firstName: firstName,
                            lastName: lastName,
                            email: email,
                            passwordHash: passwordHash
                        });
                        return [2 /*return*/, this.usersRepository.save(newUser)];
                }
            });
        });
    };
    UtilisateurService.prototype.validateUser = function (email, pass) {
        return __awaiter(this, void 0, Promise, function () {
            var user, isPasswordMatching, passwordHash, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.usersRepository.findOne({ where: { email: email } })];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            return [2 /*return*/, null];
                        }
                        return [4 /*yield*/, bcrypt.compare(pass, user.passwordHash)];
                    case 2:
                        isPasswordMatching = _a.sent();
                        if (isPasswordMatching) {
                            passwordHash = user.passwordHash, result = __rest(user, ["passwordHash"]);
                            return [2 /*return*/, result];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    UtilisateurService.prototype.login = function (loginUserDto) {
        return __awaiter(this, void 0, void 0, function () {
            var user, payload;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.validateUser(loginUserDto.email, loginUserDto.password)];
                    case 1:
                        user = _a.sent();
                        if (!user) {
                            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect.');
                        }
                        payload = {
                            email: user.email,
                            sub: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName
                        };
                        return [2 /*return*/, {
                                access_token: this.jwtService.sign(payload),
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    firstName: user.firstName,
                                    lastName: user.lastName
                                }
                            }];
                }
            });
        });
    };
    /**
     * Invalide un jeton JWT en l'ajoutant à la liste noire.
     * Cela rend le jeton inutilisable pour les requêtes futures.
     * @param token Le jeton JWT à déconnecter.
     * @returns Un message de confirmation de déconnexion.
     */
    UtilisateurService.prototype.logout = function (token) {
        return __awaiter(this, void 0, Promise, function () {
            var decodedToken, expirationDate, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        decodedToken = this.jwtService.decode(token);
                        if (!decodedToken || !decodedToken.exp) {
                            throw new common_1.BadRequestException("Jeton invalide ou sans date d'expiration.");
                        }
                        expirationDate = new Date(decodedToken.exp * 1000);
                        // Si le token est déjà expiré, pas besoin de l'invalider.
                        if (expirationDate <= new Date()) {
                            return [2 /*return*/, { message: 'Déconnexion réussie (jeton déjà expiré).' }];
                        }
                        // Ajouter le token à la liste noire
                        return [4 /*yield*/, this.invalidatedTokenService.invalidateToken(token, expirationDate)];
                    case 1:
                        // Ajouter le token à la liste noire
                        _a.sent();
                        return [2 /*return*/, { message: 'Déconnexion réussie.' }];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Erreur lors de la déconnexion :', error_1);
                        throw new common_1.BadRequestException('Impossible de déconnecter le jeton.');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    UtilisateurService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(utilisateur_entity_1.Utilisateur))
    ], UtilisateurService);
    return UtilisateurService;
}());
exports.UtilisateurService = UtilisateurService;
