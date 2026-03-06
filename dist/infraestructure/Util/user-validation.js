import joi from "joi";
const roleValues = ["Admin", "Docente", "DocenteExperto"];
function validateUserData(data) {
    const userSchema = joi.object({
        nombre: joi
            .string()
            .trim()
            .min(3)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)
            .required()
            .messages({
            "string.base": "El nombre debe ser un texto",
            "string.empty": "El nombre es requerido",
            "string.min": "El nombre debe tener al menos 3 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras y espacios",
        }),
        email: joi
            .string()
            .email({ tlds: { allow: false } })
            .required()
            .messages({
            "string.email": "Correo electrónico no válido",
            "string.empty": "El correo es requerido",
        }),
        password_hash: joi
            .string()
            .min(6)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
            .required()
            .messages({
            "string.min": "La contraseña debe tener al menos 6 caracteres",
            "string.pattern.base": "La contraseña debe tener letras y números",
            "string.empty": "La contraseña es requerida",
        }),
        activo: joi
            .boolean()
            .default(true)
            .messages({
            "boolean.base": "El campo activo debe ser verdadero o falso",
        }),
    }).unknown(false);
    const { error, value } = userSchema.validate(data, {
        abortEarly: false,
        convert: true,
    });
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
