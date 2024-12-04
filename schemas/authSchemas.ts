import { z } from 'zod';

export const getSignInSchema = () => {
  return z
    .object({
      cpf_cnpj: z.string({ required_error: 'Campo obrigatório' }).refine(
        (value) => value.replace(/\D/g, '').length === 11 || value.replace(/\D/g, '').length === 14, {
        message: 'CPF/CNPJ inválido',
      }),
    })
    .required();
};

export type SignInData = {
  cpf_cnpj: string;
};
