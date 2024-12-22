import Joi from "joi";

export const budgetValidation = (data: {
  title: string;
  total_amount: number;
  duration: string;
}) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    total_amount: Joi.number().min(0).required(),
    duration: Joi.string()
      .valid("daily", "weekly", "monthly", "yearly")
      .required(),
  });
  return schema.validate(data);
};
