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
exports.TypeCarburantController = void 0;
var common_1 = require("@nestjs/common");
var TypeCarburantController = /** @class */ (function () {
    function TypeCarburantController(typeCarburantService) {
        this.typeCarburantService = typeCarburantService;
    }
    TypeCarburantController.prototype.create = function (createTypeDto) {
        return this.typeCarburantService.create(createTypeDto);
    };
    TypeCarburantController.prototype.findAll = function () {
        return this.typeCarburantService.findAll();
    };
    TypeCarburantController.prototype.findOne = function (id) {
        return this.typeCarburantService.findOne(id);
    };
    __decorate([
        common_1.Post(),
        common_1.UsePipes(new common_1.ValidationPipe()),
        __param(0, common_1.Body())
    ], TypeCarburantController.prototype, "create");
    __decorate([
        common_1.Get()
    ], TypeCarburantController.prototype, "findAll");
    __decorate([
        common_1.Get(':id'),
        __param(0, common_1.Param('id', common_1.ParseIntPipe))
    ], TypeCarburantController.prototype, "findOne");
    TypeCarburantController = __decorate([
        common_1.Controller('type-carburant')
    ], TypeCarburantController);
    return TypeCarburantController;
}());
exports.TypeCarburantController = TypeCarburantController;
