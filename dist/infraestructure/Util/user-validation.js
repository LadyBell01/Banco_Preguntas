import joi from "joi";
const roleValues = ["Admin", "Docente", "DocenteExperto"];
function validateUserData(data) {
    const userSchema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)
            .required()
            .messages({
            'string.base': 'El nombre debe ser un texto',
            'string.empty': 'El nombre es requerido',
            'string.min': 'El nombre debe tener al menos 3 caracteres',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios'
        }),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
            'string.email': 'Correo electrónico no válido',
            'string.empty': 'El correo es requerido'
        }),
        password: joi
            .string()
            .min(6)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .required()
            .messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'string.pattern.base': 'La contraseña debe tener letras y números',
            'string.empty': 'La contraseña es requerida'
        }),
        role: joi
            .string()
            .valid(...roleValues)
            .default("Docente")
            .messages({
            'string.base': 'El rol debe ser un texto',
            'any.only': 'El rol debe ser: Admin, Docente o DocenteExperto'
        }),
        status: joi
            .number()
            .valid(0, 1)
            .default(1)
            .messages({
            'number.base': 'El estado debe ser numérico',
            'any.only': 'El estado debe ser 0 o 1'
        }),
    }).unknown(false);
    const { error, value } = userSchema.validate(data, { abortEarly: false });
    return { error, value };
}
export const loadUserData = (data) => {
    const result = validateUserData(data);
    if (result.error) {
        const message = result.error.details.map(d => d.message).join(', ');
        throw new Error(message);
    }
    return result.value;
};
