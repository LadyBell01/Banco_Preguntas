import { Repository } from "typeorm";
import { Option as OptionDomain } from "../../domain/entities/Option.js";
import { Option as OptionEntity } from "../entities/Option.js";
import { OptionPort } from "../../domain/ports/OptionPort.js";
import { AppDataSource } from "../config/data-base.js";

export class OptionAdapter implements OptionPort {
  private optionRepository: Repository<OptionEntity>;

  constructor() {
    this.optionRepository = AppDataSource.getRepository(OptionEntity);
  }

  private toDomain(option: OptionEntity): OptionDomain {
    return {
      id: option.id_option,
      text: option.text_option,
      isCorrect: option.is_correct_option,
      questionId: option.question_id,
      active: option.active_option,
    };
  }

  private toEntity(option: Omit<OptionDomain, "id">): OptionEntity {
    const optionEntity = new OptionEntity();
    optionEntity.text_option = option.text;
    optionEntity.is_correct_option = option.isCorrect;
    optionEntity.question_id = option.questionId;
    optionEntity.active_option = option.active;
    return optionEntity;
  }

  async createOption(option: Omit<OptionDomain, "id">): Promise<number> {
    try {
      const newOption = this.toEntity(option);
      const savedOption = await this.optionRepository.save(newOption);
      return savedOption.id_option;
    } catch (error) {
      console.error("Error creando opción:", error);
      throw new Error("Error al crear opción");
    }
  }

  async createOptions(options: Omit<OptionDomain, "id">[]): Promise<number[]> {
    try {
      const newOptions = options.map((opt) => this.toEntity(opt));
      const savedOptions = await this.optionRepository.save(newOptions);
      return savedOptions.map((opt) => opt.id_option);
    } catch (error) {
      console.error("Error creando opciones:", error);
      throw new Error("Error al crear opciones");
    }
  }

  async updateOption(id: number, option: Partial<OptionDomain>): Promise<boolean> {
    try {
      const existingOption = await this.optionRepository.findOne({
        where: { id_option: id },
      });
      if (!existingOption) return false;

      Object.assign(existingOption, {
        text_option: option.text ?? existingOption.text_option,
        is_correct_option: option.isCorrect ?? existingOption.is_correct_option,
        question_id: option.questionId ?? existingOption.question_id,
        active_option: option.active ?? existingOption.active_option,
      });

      await this.optionRepository.save(existingOption);
      return true;
    } catch (error) {
      console.error("Error actualizando opción:", error);
      throw new Error("Error actualizando opción");
    }
  }

  async deleteOption(id: number): Promise<boolean> {
    try {
      const existingOption = await this.optionRepository.findOne({
        where: { id_option: id },
      });
      if (!existingOption) return false;

      existingOption.active_option = 0;
      await this.optionRepository.save(existingOption);
      return true;
    } catch (error) {
      console.error("Error al dar de baja la opción:", error);
      throw new Error("Error al dar de baja opción");
    }
  }

  async deleteOptionsByQuestionId(questionId: number): Promise<boolean> {
    try {
      await this.optionRepository.update(
        { question_id: questionId },
        { active_option: 0 }
      );
      return true;
    } catch (error) {
      console.error("Error al dar de baja las opciones:", error);
      throw new Error("Error al dar de baja opciones de la pregunta");
    }
  }

  async getOptionById(id: number): Promise<OptionDomain | null> {
    try {
      const option = await this.optionRepository.findOne({
        where: { id_option: id },
      });
      return option ? this.toDomain(option) : null;
    } catch (error) {
      console.error("Error obteniendo opción por ID:", error);
      throw new Error("Error obteniendo opción");
    }
  }

  async getOptionsByQuestionId(questionId: number): Promise<OptionDomain[]> {
    try {
      const options = await this.optionRepository.find({
        where: { question_id: questionId, active_option: 1 },
      });
      return options.map((opt) => this.toDomain(opt));
    } catch (error) {
      console.error("Error obteniendo opciones de la pregunta:", error);
      throw new Error("Error obteniendo opciones");
    }
  }
}
