import { AppDataSource } from '../config/data-base.js';
import { QuestionValidation } from '../../domain/entities/QuestionValidation.js';
import { QuestionValidationPort } from '../../domain/ports/QuestionValidationPort.js';
import { QuestionValidationEntity } from '../entities/QuestionValidation.js';

export class QuestionValidationAdapter implements QuestionValidationPort {
  private repository = AppDataSource.getRepository(QuestionValidationEntity);

  async create(validation: QuestionValidation): Promise<QuestionValidation> {
    const newValidation = this.repository.create(validation as any);
    return (await this.repository.save(newValidation)) as unknown as QuestionValidation;
  }

  async findByQuestionId(questionId: number): Promise<QuestionValidation[]> {
    return await this.repository.find({
      where: { questionId },
      order: { validatedAt: 'DESC' }
    });
  }

  async findByValidatorId(validatorId: number): Promise<QuestionValidation[]> {
    return await this.repository.find({
      where: { validatorId },
      order: { validatedAt: 'DESC' }
    });
  }
}
