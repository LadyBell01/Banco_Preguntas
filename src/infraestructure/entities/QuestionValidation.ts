import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { QuestionValidation as IQuestionValidation, ValidationResult } from '../../domain/entities/QuestionValidation.js';

@Entity('question_validations')
export class QuestionValidationEntity implements IQuestionValidation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'int' })
  questionId!: number;

  @Column({ type: 'int' })
  validatorId!: number;

  @Column({ type: 'enum', enum: ValidationResult })
  result!: ValidationResult;

  @Column({ type: 'text' })
  observations!: string;

  @CreateDateColumn({ type: 'timestamp' })
  validatedAt!: Date;
}
