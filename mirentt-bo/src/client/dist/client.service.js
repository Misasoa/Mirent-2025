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
exports.ClientService = void 0;
var common_1 = require("@nestjs/common");
var typeorm_1 = require("@nestjs/typeorm");
var client_entity_1 = require("src/entities/client.entity");
var ClientService = /** @class */ (function () {
    function ClientService(clientRepository) {
        this.clientRepository = clientRepository;
    }
    //*ajout//
    ClientService.prototype.findOneById = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.findOne({ where: { id: id } })];
                    case 1:
                        client = _a.sent();
                        return [2 /*return*/, client !== null && client !== void 0 ? client : undefined];
                }
            });
        });
    };
    ClientService.prototype.getClientCount = function () {
        return __awaiter(this, void 0, Promise, function () {
            var availableClientCount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.count({})];
                    case 1:
                        availableClientCount = _a.sent();
                        if (availableClientCount === 0) {
                            throw new common_1.NotFoundException('Aucun client disponible trouvé');
                        }
                        return [2 /*return*/, availableClientCount];
                }
            });
        });
    };
    ClientService.prototype.findAll = function () {
        return this.clientRepository.find();
    };
    ClientService.prototype.remove = function (id) {
        var _a;
        return __awaiter(this, void 0, Promise, function () {
            var result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.clientRepository["delete"](id)];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, ((_a = result.affected) !== null && _a !== void 0 ? _a : 0) > 0];
                }
            });
        });
    };
    ClientService.prototype.create = function (dto, logo) {
        return __awaiter(this, void 0, Promise, function () {
            var client;
            return __generator(this, function (_a) {
                client = this.clientRepository.create(__assign(__assign({}, dto), { logo: logo || undefined }));
                return [2 /*return*/, this.clientRepository.save(client)];
            });
        });
    };
    ClientService.prototype.findOne = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.findOne({ where: { id: id } })];
                    case 1:
                        client = _a.sent();
                        if (!client) {
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, client];
                }
            });
        });
    };
    ClientService.prototype.update = function (id, dto, logo) {
        return __awaiter(this, void 0, Promise, function () {
            var client;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientRepository.findOne({ where: { id: id } })];
                    case 1:
                        client = _a.sent();
                        if (!client) {
                            throw new common_1.NotFoundException('Client non trouvé');
                        }
                        client.lastName = dto.lastName || client.lastName;
                        client.email = dto.email || client.email;
                        client.phone = dto.phone || client.phone;
                        client.logo = logo || client.logo;
                        return [4 /*yield*/, this.clientRepository.save(client)];
                    case 2: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ClientService = __decorate([
        common_1.Injectable(),
        __param(0, typeorm_1.InjectRepository(client_entity_1.Client))
    ], ClientService);
    return ClientService;
}());
exports.ClientService = ClientService;
