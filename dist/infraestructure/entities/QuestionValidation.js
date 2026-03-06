var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
import { Question } from "./Question.js";
import { User } from "./User.js";
export var ValidationResultEnum;
(function (ValidationResultEnum) {
    ValidationResultEnum["APROBADA"] = "Aprobada";
    ValidationResultEnum["RECHAZADA"] = "Rechazada";
})(ValidationResultEnum || (ValidationResultEnum = {}));
let QuestionValidation = class QuestionValidation {
    id_question_validations;
    questionId;
    validator_id;
    result_validation;
    observations_validation;
    validated_at;
    question;
    validator;
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], QuestionValidation.prototype, "id_question_validations", void 0);
__decorate([
    Column({ type: "integer" }),
    __metadata("design:type", Number)
], QuestionValidation.prototype, "questionId", void 0);
__decorate([
    Column({ type: "integer" }),
    __metadata("design:type", Number)
], QuestionValidation.prototype, "validator_id", void 0);
__decorate([
    Column({
        type: "enum",
        enum: ValidationResultEnum,
    }),
    __metadata("design:type", String)
], QuestionValidation.prototype, "result_validation", void 0);
__decorate([
    Column({ type: "text" }),
    __metadata("design:type", String)
], QuestionValidation.prototype, "observations_validation", void 0);
__decorate([
    CreateDateColumn({ type: "timestamp" }),
    __metadata("design:type", Date)
], QuestionValidation.prototype, "validated_at", void 0);
__decorate([
    ManyToOne(() => Question, (question) => question.validations),
    JoinColumn({ name: "questionId" }),
    __metadata("design:type", Question)
], QuestionValidation.prototype, "question", void 0);
__decorate([
    ManyToOne(() => User),
    JoinColumn({ name: "validator_id" }),
    __metadata("design:type", User)
], QuestionValidation.prototype, "validator", void 0);
QuestionValidation = __decorate([
    Entity("question_validations")
], QuestionValidation);
export { QuestionValidation };
