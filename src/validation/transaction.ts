import Joi from "joi";

export const transactionValidation = (data: {
  amount: number;
  category: string;
  narration: string;
}) => {
  const schema = Joi.object({
    amount: Joi.number().min(0).required(),
    category: Joi.string().min(3).required(),
    narration: Joi.string().min(3).required(),
  });
  return schema.validate(data);
}; 