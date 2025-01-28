import { z } from 'zod';

export const getWifiSchema = () => {
    return z
        .object({
            password: z.string({ required_error: 'Campo obrigatório' })
                .min(8, 'A senha deve ter no mínimo 8 caracteres')
                .max(32, 'A senha deve ter no máximo 32 caracteres')
                .regex(/^[a-zA-Z0-9-]+$/, 'A senha só pode conter letras, números e hifén.')
                .refine(name => !/(.)\1{3,}/.test(name), {
                    message: "A senha não pode conter sequências repetidas longas",
                }),
            confirmPassword: z.string({ required_error: 'Campo obrigatório' })
        })
        .required()
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: "As senhas não coincidem",
        })
        .refine(data => data.password.trim() === data.password, {
            path: ['password'],
            message: "A senha não pode conter espaços em branco no início ou fim",
        });
};

export type WifiData = {
    password: string;
    confirmPassword: string;
};

export const getWifiNameSchema = () => {
    return z
        .object({
            name: z.string({ required_error: 'Campo obrigatório' })
                .min(8, 'O nome deve ter no mínimo 8 caracteres')
                .max(32, 'O nome deve ter no máximo 32 caracteres')
                .regex(/^[a-zA-Z0-9-]+$/, 'O nome só pode conter letras, números e hifén.')
                .refine(name => !/(.)\1{3,}/.test(name), {
                    message: "O nome não pode conter sequências repetidas longas",
                }),
            confirmName: z.string({ required_error: 'Campo obrigatório' })
        })
        .required()
        .refine((data) => data.name === data.confirmName, {
            path: ['confirmName'],
            message: "Os nomes não coincidem",
        })
        .refine(data => data.name.trim() === data.name, {
            path: ['name'],
            message: "O nome não pode conter espaços em branco no início ou fim",
        });
};

export type WifiNameData = {
    name: string;
    confirmName: string;
};