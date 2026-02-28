import joi from "joi";

const resultValues = ["Aprobada", "Rechazada"];

export type ReturnValidationData = {
  questionId: number;
  result: string;
  observations: string;
};

type ValidationValidationData = {
  error: joi.ValidationError | undefined;
  value: ReturnValidationData;
};

function validateValidationData(data: any): ValidationValidationData {
  const validationSchema = joi.object({
    questionId: joi
      .number()
      .integer()
      .positive()
      .required()
      .messages({
        "number.base": "El ID de pregunta debe ser un número",
        "number.integer": "El ID de pregunta debe ser un número entero",
        "number.positive": "El ID de pregunta debe ser positivo",
        "any.required": "El ID de pregunta es requerido",
      }),

    result: joi
      .string()
      .valid(...resultValues)
      .required()
      .messages({
        "string.base": "El resultado debe ser un texto",
        "any.only": "El resultado debe ser: Aprobada o Rechazada",
        "any.required": "El resultado es requerido",
      }),

    observations: joi
      .string()
      .trim()
      .min(10)
      .max(2000)
      .required()
      .messages({
        "string.base": "Las observaciones deben ser un texto",
        "string.empty": "Las observaciones son requeridas",
        "string.min": "Las observaciones deben tener al menos 10 caracteres",
        "string.max": "Las observaciones no pueden exceder 2000 caracteres",
        "any.required": "Las observaciones son requeridas",
      }),
  }).unknown(false);

  const { error, value } = validationSchema.validate(data, { abortEarly: false });
  return { error, value };
}

export const loadValidationData = (data: any): ReturnValidationData => {
  const result = validateValidationData(data);
  if (result.error) {
    const message = result.error.details.map((d) => d.message).join(", ");
    throw new Error(message);
  }
  return result.value;
};
