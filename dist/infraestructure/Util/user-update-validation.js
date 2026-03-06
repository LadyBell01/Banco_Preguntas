import joi from "joi";
const roleValues = ["Admin", "Docente", "DocenteExperto"];
function validateUpdateUserData(data) {
    const schema = joi
        .object({
        nombre: joi
            .string()
            .trim()
            .min(3)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)*$/)
            .messages({
            "string.min": "El nombre debe tener al menos 3 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras y espacios",
        }),
        email: joi
            .string()
            .trim()
            .email({ tlds: { allow: false } })
            .messages({
            "string.email": "Correo electrónico no válido",
        }),
        password_hash: joi
            .string()
            .min(6)
            .messages({
            "string.min": "La contraseña debe tener al menos 6 caracteres",
            "string.base": "La contraseña debe ser texto",
        }),
        activo: joi
            .boolean()
            .messages({
            "boolean.base": "El campo activo debe ser verdadero o falso",
        }),
    })
        .unknown(false)
        .or("nombre", "email", "password_hash", "activo");
    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });
    return { error, value };
}
export const loadUpdateUserData = (data) => {
    const result = validateUpdateUserData(data);
    if (result.error) {
        const message = result.error.details.map((d) => d.message).join(", ");
        throw new Error(message);
    }
    return result.value;
};
