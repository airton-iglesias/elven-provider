import { z } from 'zod';

export const getSignInSchema = () => {
  return z
    .object({
      cpf_cnpj: z.string()
        .refine((value) => {
          const cleaned = value.replace(/\D/g, '');
          return cleaned.length === 11 || cleaned.length === 14;
        }, {
          message: 'CPF/CNPJ inválido',
        }),
    })
    .required();
};

export type SignInData = {
  cpf_cnpj: string;
};
