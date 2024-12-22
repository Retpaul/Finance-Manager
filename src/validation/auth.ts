import Joi from "joi";

export const registerValidation = (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .alphanum()

      .required(),
  });
  return schema.validate(data);
};
export const LoginValidation = (data: { email: string; password: string }) => {
  const schema = Joi.object({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string()
      .alphanum()

      .required(),
  });
  return schema.validate(data);
};
