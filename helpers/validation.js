const Joi = require("joi");

const userValidate = (data) => {
    const UserSchema = Joi.object({
        email: Joi.string()
            .pattern(new RegExp("gmail.com$"))
            .email()
            .lowercase()
            .required(),
        username: Joi.string().alphanum().min(6).max(30).lowercase(),
        password: Joi.string().min(6).max(32).required(),
    });
    return UserSchema.validate(data);
};

module.exports = {
    userValidate,
};
