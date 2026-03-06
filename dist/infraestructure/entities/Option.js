var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "./Question.js";
let Option = class Option {
    id_options;
    text_option;
    is_correct_option;
    question_id;
    active_option;
    question;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Option.prototype, "id_options", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Option.prototype, "text_option", void 0);
__decorate([
    Column({ type: "boolean", default: false }),
    __metadata("design:type", Boolean)
], Option.prototype, "is_correct_option", void 0);
__decorate([
    Column({ type: "integer" }),
    __metadata("design:type", Number)
], Option.prototype, "question_id", void 0);
__decorate([
    Column({ type: "integer", default: 1 }),
    __metadata("design:type", Number)
], Option.prototype, "active_option", void 0);
__decorate([
    ManyToOne(() => Question, (question) => question.options),
    JoinColumn({ name: "question_id" }),
    __metadata("design:type", Question)
], Option.prototype, "question", void 0);
Option = __decorate([
    Entity("options")
], Option);
export { Option };
