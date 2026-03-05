import { Option } from "../entities/Option.js";

export interface OptionPort {
  createOption(option: Omit<Option, "id">): Promise<number>;
  createOptions(options: Omit<Option, "id">[]): Promise<number[]>;
  updateOption(id: number, option: Partial<Option>): Promise<boolean>;
  deleteOption(id: number): Promise<boolean>;
  deleteOptionsByQuestionId(questionId: number): Promise<boolean>;
  getOptionById(id: number): Promise<Option | null>;
  getOptionsByQuestionId(questionId: number): Promise<Option[]>;
}
