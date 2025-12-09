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
exports.ClientController = void 0;
var common_1 = require("@nestjs/common");
var platform_express_1 = require("@nestjs/platform-express");
var multer_1 = require("multer");
var path_1 = require("path");
var ClientController = /** @class */ (function () {
    function ClientController(clientService, proformaService) {
        this.clientService = clientService;
        this.proformaService = proformaService;
    }
    ClientController.prototype.getClientCount = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientService.getClientCount()];
            });
        });
    };
    ClientController.prototype.findAll = function () {
        return __awaiter(this, void 0, Promise, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientService.findAll()];
            });
        });
    };
    /**ajoutt */
    ClientController.prototype.findOne = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.clientService.findOne(id)]; // Utilisez le service pour récupérer le client
            });
        });
    };
    ClientController.prototype.update = function (id, dto, file) {
        return __awaiter(this, void 0, Promise, function () {
            var logo, updateClient, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        logo = file
                            ? "http://localhost:3000/uploads/" + file.filename
                            : undefined;
                        return [4 /*yield*/, this.clientService.update(id, dto, logo)];
                    case 1:
                        updateClient = _a.sent();
                        return [2 /*return*/, updateClient];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error during filr upload or update:', error_1);
                        throw new common_1.InternalServerErrorException('Internal server error');
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ClientController.prototype.create = function (dto, file) {
        return __awaiter(this, void 0, Promise, function () {
            var logo;
            return __generator(this, function (_a) {
                logo = file
                    ? "http://localhost:3000/uploads/" + file.filename
                    : undefined;
                return [2 /*return*/, this.clientService.create(dto, logo)];
            });
        });
    };
    ClientController.prototype.remove = function (id) {
        return __awaiter(this, void 0, Promise, function () {
            var deleted;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientService.remove(id)];
                    case 1:
                        deleted = _a.sent();
                        if (!deleted) {
                            throw new common_1.NotFoundException("Client avec ID " + id + " introuvable");
                        }
                        return [2 /*return*/, { message: 'Client supprimé avec succès' }];
                }
            });
        });
    };
    ClientController.prototype.getClientProformaItems = function (clientId) {
        return __awaiter(this, void 0, void 0, function () {
            var items, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("Backend: Requ\u00EAte re\u00E7ue pour les items de proforma du client ID: " + clientId);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.proformaService.getProformaItemsByClientId(clientId)];
                    case 2:
                        items = _a.sent();
                        console.log("Backend: " + items.length + " items de proforma trouv\u00E9s pour le client ID: " + clientId);
                        return [2 /*return*/, items];
                    case 3:
                        error_2 = _a.sent();
                        console.error("Backend: Erreur lors de la r\u00E9cup\u00E9ration des items de proforma pour le client " + clientId + ":", error_2);
                        throw new common_1.InternalServerErrorException('Erreur lors du chargement des items de proforma.');
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    __decorate([
        common_1.Get('client-count')
    ], ClientController.prototype, "getClientCount");
    __decorate([
        common_1.Get()
    ], ClientController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], ClientController.prototype, "findOne");
    __decorate([
        common_1.Put(':id'),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('logo', {
            storage: multer_1.diskStorage({
                destination: './uploads',
                filename: function (req, file, callback) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, file.fieldname + "-" + uniqueSuffix + path_1.extname(file.originalname));
                }
            })
        })),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __param(2, common_1.UploadedFile())
    ], ClientController.prototype, "update");
    __decorate([
        common_1.Post(),
        common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
        common_1.UseInterceptors(platform_express_1.FileInterceptor('logo', {
            storage: multer_1.diskStorage({
                destination: './uploads',
                filename: function (req, file, callback) {
                    var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    callback(null, file.fieldname + "-" + uniqueSuffix + path_1.extname(file.originalname));
                }
            })
        })),
        __param(0, common_1.Body()),
        __param(1, common_1.UploadedFile())
    ], ClientController.prototype, "create");
    __decorate([
        common_1.Delete(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], ClientController.prototype, "remove");
    __decorate([
        common_1.Get(':clientId/proforma-items'),
        __param(0, common_1.Param('clientId', common_1.ParseIntPipe))
    ], ClientController.prototype, "getClientProformaItems");
    ClientController = __decorate([
        common_1.Controller('clients')
    ], ClientController);
    return ClientController;
}());
exports.ClientController = ClientController;
