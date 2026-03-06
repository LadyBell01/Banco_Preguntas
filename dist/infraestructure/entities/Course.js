var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Unit } from "./Unit.js";
let Course = class Course {
    id_courses;
    name_course;
    description_course;
    status_course;
    units;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Course.prototype, "id_courses", void 0);
__decorate([
    Column({ type: "character varying", length: 255 }),
    __metadata("design:type", String)
], Course.prototype, "name_course", void 0);
__decorate([
    Column({ type: "text", nullable: true }),
    __metadata("design:type", String)
], Course.prototype, "description_course", void 0);
__decorate([
    Column({ type: "integer", default: 1 }),
    __metadata("design:type", Number)
], Course.prototype, "status_course", void 0);
__decorate([
    OneToMany(() => Unit, (unit) => unit.course),
    __metadata("design:type", Array)
], Course.prototype, "units", void 0);
Course = __decorate([
    Entity("courses")
], Course);
export { Course };
