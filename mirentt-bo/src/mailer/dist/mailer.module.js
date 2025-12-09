"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MailerModule = void 0;
// mailer.module.ts
var mailer_1 = require("@nestjs-modules/mailer");
var handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
var common_1 = require("@nestjs/common");
var mailer_service_1 = require("./mailer.service");
console.log('__dirname dans MailerModule:', __dirname);
var MailerModule = /** @class */ (function () {
    function MailerModule() {
    }
    MailerModule = __decorate([
        common_1.Module({
            imports: [
                mailer_1.MailerModule.forRoot({
                    transport: {
                        host: process.env.SMTP_HOST,
                        port: parseInt(process.env.SMTP_PORT || '587', 10),
                        secure: process.env.SMTP_SECURE === 'true',
                        auth: {
                            user: process.env.SMTP_USER,
                            pass: process.env.SMTP_PASS
                        }
                    },
                    defaults: {
                        from: "\"Mirent Location\" <" + process.env.SMTP_FROM_EMAIL + ">"
                    },
                    template: {
                        dir: __dirname + '/templates',
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: false
                        }
                    }
                }),
            ],
            providers: [mailer_service_1.MailService],
            exports: [mailer_service_1.MailService, mailer_1.MailerModule]
        })
    ], MailerModule);
    return MailerModule;
}());
exports.MailerModule = MailerModule;
