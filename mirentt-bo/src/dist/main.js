"use strict";
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
var core_1 = require("@nestjs/core");
var app_module_1 = require("./app.module");
var common_1 = require("@nestjs/common");
var all_eceptionfilters_1 = require("./filters/all-eceptionfilters");
require("reflect-metadata");
var path_1 = require("path");
var express = require("express");
var cors = require("cors");
var dotenv = require("dotenv");
function bootstrap() {
    return __awaiter(this, void 0, void 0, function () {
        var app, PORT, logger;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, core_1.NestFactory.create(app_module_1.AppModule)];
                case 1:
                    app = _a.sent();
                    app.useLogger(new common_1.Logger());
                    dotenv.config();
                    // Loggez le secret JWT au démarrage de l'application
                    console.log('JWT_SECRET (from .env at startup):', 'ghioouitu5632iiuo');
                    if (!process.env.JWT_SECRET) {
                        console.error('CRITICAL ERROR: JWT_SECRET is not set in environment!');
                        process.exit(1);
                    }
                    // Activer CORS pour tout le backend
                    app.use(cors({
                        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
                        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                        allowedHeaders: ['Content-Type', 'Authorization'],
                        credentials: true
                    }));
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true,
                        disableErrorMessages: false,
                        exceptionFactory: function (errors) {
                            console.log(errors); // Log des erreurs détaillées
                            throw new common_1.BadRequestException(errors);
                        }
                    }));
                    // Middleware pour ajouter les en-têtes CORS aux fichiers statiques
                    app.use('/uploads', function (req, res, next) {
                        res.header('Access-Control-Allow-Origin', '*');
                        res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
                        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
                        next();
                    });
                    // Gérer les fichiers statiques avec Express
                    app.use('/uploads', express.static(path_1.join(__dirname, '..', 'uploads')));
                    // Ajout de la validation globale pour sécuriser les entrées
                    app.useGlobalPipes(new common_1.ValidationPipe({
                        whitelist: true,
                        forbidNonWhitelisted: true,
                        transform: true
                    }));
                    PORT = process.env.PORT || 3000;
                    logger = new common_1.Logger('Main');
                    app.useGlobalFilters(new all_eceptionfilters_1.AllExceptionsFilter());
                    app.enableCors();
                    return [4 /*yield*/, app.listen(PORT)];
                case 2:
                    _a.sent();
                    common_1.Logger.log("\uD83D\uDE80 Serveur d\u00E9marr\u00E9 sur http://localhost:" + PORT);
                    return [2 /*return*/];
            }
        });
    });
}
bootstrap();
