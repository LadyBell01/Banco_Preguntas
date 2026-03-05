var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { CategoryEntity as Category } from "./Category.js";
import { Option } from "./Option.js";
export var DifficultyEnum;
(function (DifficultyEnum) {
    DifficultyEnum["BAJA"] = "Baja";
    DifficultyEnum["MEDIA"] = "Media";
    DifficultyEnum["ALTA"] = "Alta";
})(DifficultyEnum || (DifficultyEnum = {}));
export var QuestionStatusEnum;
(function (QuestionStatusEnum) {
    QuestionStatusEnum["BORRADOR"] = "Borrador";
    QuestionStatusEnum["REVISION"] = "Revisi\u00F3n";
    QuestionStatusEnum["APROBADA"] = "Aprobada";
    QuestionStatusEnum["RECHAZADA"] = "Rechazada";
    QuestionStatusEnum["PUBLICADA"] = "Publicada";
})(QuestionStatusEnum || (QuestionStatusEnum = {}));
let Question = class Question {
    id_question;
    statement_question;
    difficulty_question;
    category_id;
    status_question;
    active_question;
    category;
    options;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Question.prototype, "id_question", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], Question.prototype, "statement_question", void 0);
__decorate([
    Column({
        type: "enum",
        enum: DifficultyEnum,
        default: DifficultyEnum.MEDIA,
    }),
    __metadata("design:type", String)
], Question.prototype, "difficulty_question", void 0);
__decorate([
    Column({ type: "integer" }),
    __metadata("design:type", Number)
], Question.prototype, "category_id", void 0);
__decorate([
    Column({
        type: "enum",
        enum: QuestionStatusEnum,
        default: QuestionStatusEnum.BORRADOR,
    }),
    __metadata("design:type", String)
], Question.prototype, "status_question", void 0);
__decorate([
    Column({ type: "integer", default: 1 }),
    __metadata("design:type", Number)
], Question.prototype, "active_question", void 0);
__decorate([
    ManyToOne(() => Category),
    JoinColumn({ name: "category_id" }),
    __metadata("design:type", Category)
], Question.prototype, "category", void 0);
__decorate([
    OneToMany(() => Option, (option) => option.question, { cascade: true }),
    __metadata("design:type", Array)
], Question.prototype, "options", void 0);
Question = __decorate([
    Entity("questions")
], Question);
export { Question };
