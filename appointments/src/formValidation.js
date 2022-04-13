// GET OUT FRAMEWORK LAND SOON AS POSSIBLE! 
// Retorna todos os validadores até um retornar uma string
export const list = (...validators) => value =>
    validators.reduce(
        (result, validator) => result || validator(value),
        undefined
    );

export const match = (re, description) => value => !value.match(re) ? description : undefined;

export const required = description => value =>
    !value || value.trim() === '' ? description : undefined;

export const hasError = (validationErrors, fieldName) =>
    validationErrors[fieldName] !== undefined;

export const validateMany = (validators, fields) =>
    Object.entries(fields).reduce(
        (result, [name, value]) => ({
            ...result,
            [name]: validators[name](value)
        }),
        {}
    );

export const anyErrors = errors =>
    Object.values(errors).some(error => error !== undefined);
