import { AppDataSource } from '../config/data-base.js';
import { QuestionValidationEntity } from '../entities/QuestionValidation.js';
export class QuestionValidationAdapter {
    repository = AppDataSource.getRepository(QuestionValidationEntity);
    async create(validation) {
        const newValidation = this.repository.create(validation);
        return (await this.repository.save(newValidation));
    }
    async findByQuestionId(questionId) {
        return await this.repository.find({
            where: { questionId },
            order: { validatedAt: 'DESC' }
        });
    }
    async findByValidatorId(validatorId) {
        return await this.repository.find({
            where: { validatorId },
            order: { validatedAt: 'DESC' }
        });
    }
}
