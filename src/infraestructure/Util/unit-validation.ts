import joi from "joi";

export type ReturnUnitData = {
  name: string;
  description: string;
  courseId: number;
  status: number;
};

type ValidationUnitData = {
  error: joi.ValidationError | undefined;
  value: ReturnUnitData;
};

function validateUnitData(data: any): ValidationUnitData {
  const unitSchema = joi.object({
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

    courseId: joi
      .number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "El ID del curso debe ser un número",
        "number.integer": "El ID del curso debe ser un número entero",
        "number.positive": "El ID del curso debe ser positivo",
        "any.required": "El ID del curso es requerido",
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

  const { error, value } = unitSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadUnitData = (data: any): ReturnUnitData => {
  const result = validateUnitData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};

export type ReturnUpdateUnitData = Partial<ReturnUnitData>;

function validateUpdateUnitData(data: any): { error: joi.ValidationError | undefined; value: ReturnUpdateUnitData } {
  const updateUnitSchema = joi.object({
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

    courseId: joi
      .number()
      .integer()
      .positive()
      .messages({
        "number.base": "El ID del curso debe ser un número",
        "number.integer": "El ID del curso debe ser un número entero",
        "number.positive": "El ID del curso debe ser positivo",
      }),

    status: joi
      .number()
      .valid(0, 1)
      .messages({
        "number.base": "El estado debe ser numérico",
        "any.only": "El estado debe ser 0 o 1",
      }),
  }).unknown(false).min(1);

  const { error, value } = updateUnitSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadUpdateUnitData = (data: any): ReturnUpdateUnitData => {
  const result = validateUpdateUnitData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
