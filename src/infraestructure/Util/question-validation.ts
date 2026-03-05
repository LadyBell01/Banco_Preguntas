import joi from "joi";

const difficultyValues = ["Baja", "Media", "Alta"];
const statusValues = ["Borrador", "Revisión", "Aprobada", "Rechazada", "Publicada"];

const optionSchema = joi.object({
  text: joi
    .string()
    .trim()
    .min(1)
    .max(1000)
    .required()
    .messages({
      "string.base": "El texto de la opción debe ser un texto",
      "string.empty": "El texto de la opción es requerido",
      "string.min": "El texto de la opción no puede estar vacío",
      "string.max": "El texto de la opción no puede exceder 1000 caracteres",
    }),
  isCorrect: joi
    .boolean()
    .required()
    .messages({
      "boolean.base": "isCorrect debe ser un valor booleano",
      "any.required": "isCorrect es requerido",
    }),
});

export type ReturnQuestionData = {
  statement: string;
  difficulty: string;
  categoryId: number;
  status: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
};

type ValidationQuestionData = {
  error: joi.ValidationError | undefined;
  value: ReturnQuestionData;
};

function validateQuestionData(data: any): ValidationQuestionData {
  const questionSchema = joi.object({
    statement: joi
      .string()
      .trim()
      .min(10)
      .max(2000)
      .required()
      .messages({
        "string.base": "El enunciado debe ser un texto",
        "string.empty": "El enunciado es requerido",
        "string.min": "El enunciado debe tener al menos 10 caracteres",
        "string.max": "El enunciado no puede exceder 2000 caracteres",
      }),

    difficulty: joi
      .string()
      .valid(...difficultyValues)
      .required()
      .messages({
        "string.base": "La dificultad debe ser un texto",
        "any.only": "La dificultad debe ser: Baja, Media o Alta",
        "any.required": "La dificultad es requerida",
      }),

    categoryId: joi
      .number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "El ID de categoría debe ser un número",
        "number.integer": "El ID de categoría debe ser un número entero",
        "number.positive": "El ID de categoría debe ser positivo",
        "any.required": "El ID de categoría es requerido",
      }),

    status: joi
      .string()
      .valid(...statusValues)
      .default("Borrador")
      .messages({
        "string.base": "El estado debe ser un texto",
        "any.only": "El estado debe ser: Borrador, Revisión, Aprobada o Publicada",
      }),

    options: joi
      .array()
      .items(optionSchema)
      .min(2)
      .max(6)
      .required()
      .messages({
        "array.base": "Las opciones deben ser un arreglo",
        "array.min": "La pregunta debe tener al menos 2 opciones",
        "array.max": "La pregunta no puede tener más de 6 opciones",
        "any.required": "Las opciones son requeridas",
      }),
  }).unknown(false);

  const { error, value } = questionSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadQuestionData = (data: any): ReturnQuestionData => {
  const result = validateQuestionData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};

export type ReturnUpdateQuestionData = {
  statement?: string;
  difficulty?: string;
  categoryId?: number;
  status?: string;
};

function validateUpdateQuestionData(data: any): { error: joi.ValidationError | undefined; value: ReturnUpdateQuestionData } {
  const updateQuestionSchema = joi.object({
    statement: joi
      .string()
      .trim()
      .min(10)
      .max(2000)
      .messages({
        "string.base": "El enunciado debe ser un texto",
        "string.min": "El enunciado debe tener al menos 10 caracteres",
        "string.max": "El enunciado no puede exceder 2000 caracteres",
      }),

    difficulty: joi
      .string()
      .valid(...difficultyValues)
      .messages({
        "string.base": "La dificultad debe ser un texto",
        "any.only": "La dificultad debe ser: Baja, Media o Alta",
      }),

    categoryId: joi
      .number()
      .integer()
      .positive()
      .messages({
        "number.base": "El ID de categoría debe ser un número",
        "number.integer": "El ID de categoría debe ser un número entero",
        "number.positive": "El ID de categoría debe ser positivo",
      }),

    status: joi
      .string()
      .valid(...statusValues)
      .messages({
        "string.base": "El estado debe ser un texto",
        "any.only": "El estado debe ser: Borrador, Revisión, Aprobada o Publicada",
      }),
  }).unknown(false).min(1);

  const { error, value } = updateQuestionSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadUpdateQuestionData = (data: any): ReturnUpdateQuestionData => {
  const result = validateUpdateQuestionData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};

export type ReturnUpdateOptionsData = {
  options: {
    text: string;
    isCorrect: boolean;
  }[];
};

function validateUpdateOptionsData(data: any): { error: joi.ValidationError | undefined; value: ReturnUpdateOptionsData } {
  const updateOptionsSchema = joi.object({
    options: joi
      .array()
      .items(optionSchema)
      .min(2)
      .max(6)
      .required()
      .messages({
        "array.base": "Las opciones deben ser un arreglo",
        "array.min": "La pregunta debe tener al menos 2 opciones",
        "array.max": "La pregunta no puede tener más de 6 opciones",
        "any.required": "Las opciones son requeridas",
      }),
  }).unknown(false);

  const { error, value } = updateOptionsSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadUpdateOptionsData = (data: any): ReturnUpdateOptionsData => {
  const result = validateUpdateOptionsData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
