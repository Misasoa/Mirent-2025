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
exports.__esModule = true;
exports.PrixCarburantController = void 0;
var common_1 = require("@nestjs/common");
var PrixCarburantController = /** @class */ (function () {
    function PrixCarburantController(prixCarburantService) {
        this.prixCarburantService = prixCarburantService;
    }
    PrixCarburantController.prototype.create = function (createPrixDto) {
        return this.prixCarburantService.create(createPrixDto);
    };
    PrixCarburantController.prototype.findAll = function () {
        return this.prixCarburantService.findAll();
    };
    PrixCarburantController.prototype.findOne = function (id) {
        return this.prixCarburantService.findOne(id);
    };
    __decorate([
        common_1.Post(),
        common_1.UsePipes(new common_1.ValidationPipe()),
        __param(0, common_1.Body())
    ], PrixCarburantController.prototype, "create");
    __decorate([
        common_1.Get()
    ], PrixCarburantController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], PrixCarburantController.prototype, "findOne");
    PrixCarburantController = __decorate([
        common_1.Controller('prix-carburant')
    ], PrixCarburantController);
    return PrixCarburantController;
}());
exports.PrixCarburantController = PrixCarburantController;
