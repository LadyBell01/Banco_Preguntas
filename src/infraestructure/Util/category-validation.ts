import joi from "joi";

export type ReturnCategoryData = {
  name: string;
  description: string;
  status: number;
};

type ValidationCategoryData = {
  error: joi.ValidationError | undefined;
  value: ReturnCategoryData;
};

function validateCategoryData(data: any): ValidationCategoryData {
  const categorySchema = joi.object({
    name: joi
      .string()
      .trim()
      .min(3)
      .max(255)
      .required()
      .messages({
        "string.base": "El nombre debe ser un texto",
        "string.empty": "El nombre es requerido",
        "string.min": "El nombre debe tener al menos 3 caracteres",
        "string.max": "El nombre no puede exceder 255 caracteres",
      }),

    description: joi
      .string()
      .trim()
      .allow("")
      .max(1000)
      .optional()
      .messages({
        "string.base": "La descripción debe ser un texto",
        "string.max": "La descripción no puede exceder 1000 caracteres",
      }),

    status: joi
      .number()
      .valid(0, 1)
      .default(1)
      .messages({
        "number.base": "El estado debe ser numérico",
        "any.only": "El estado debe ser 0 o 1",
      }),
  }).unknown(false);

  const { error, value } = categorySchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadCategoryData = (data: any): ReturnCategoryData => {
  const result = validateCategoryData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};

export type ReturnUpdateCategoryData = Partial<ReturnCategoryData>;

function validateUpdateCategoryData(data: any): { error: joi.ValidationError | undefined; value: ReturnUpdateCategoryData } {
  const updateCategorySchema = joi.object({
    name: joi
      .string()
      .trim()
      .min(3)
      .max(255)
      .messages({
        "string.base": "El nombre debe ser un texto",
        "string.min": "El nombre debe tener al menos 3 caracteres",
        "string.max": "El nombre no puede exceder 255 caracteres",
      }),

    description: joi
      .string()
      .trim()
      .allow("")
      .max(1000)
      .messages({
        "string.base": "La descripción debe ser un texto",
        "string.max": "La descripción no puede exceder 1000 caracteres",
      }),

    status: joi
      .number()
      .valid(0, 1)
      .messages({
        "number.base": "El estado debe ser numérico",
        "any.only": "El estado debe ser 0 o 1",
      }),
  }).unknown(false).min(1);

  const { error, value } = updateCategorySchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadUpdateCategoryData = (data: any): ReturnUpdateCategoryData => {
  const result = validateUpdateCategoryData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
