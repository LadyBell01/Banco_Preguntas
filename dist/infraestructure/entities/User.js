var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn } from "../../../node_modules/typeorm/index.js";
let User = class User {
    id_user;
    name_user;
    email_user;
    password_user;
    status_user;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id_user", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "name_user", void 0);
__decorate([
    Column({ type: "varchar", length: 255, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email_user", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password_user", void 0);
__decorate([
    Column({ type: "varchar", length: 255 }),
    __metadata("design:type", Number)
], User.prototype, "status_user", void 0);
User = __decorate([
    Entity('users')
], User);
export { User };
