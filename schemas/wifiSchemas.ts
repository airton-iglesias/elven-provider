import { z } from 'zod';

export const getWifiSchema = () => {
    return z
        .object({
            password: z.string({ required_error: 'Campo obrigatório' }).min(8, 'A senha deve ter no mínimo 8 caracteres'),
            confirmPassword: z.string({ required_error: 'Campo obrigatório' }).min(8, 'A senha deve ter no mínimo 8 caracteres'),
        })
        .required()
        .refine((data) => data.password === data.confirmPassword, {
            path: ['confirmPassword'],
            message: "As senhas não coincidem",
        });
};

export type WifiData = {
    password: string;
    confirmPassword: string;
};

export const getWifiNameSchema = () => {
    return z
        .object({
            name: z.string({ required_error: 'Campo obrigatório' }).min(8, 'O nome deve ter no mínimo 8 caracteres'),
            confirmName: z.string({ required_error: 'Campo obrigatório' }).min(8, 'O nome deve ter no mínimo 8 caracteres'),
        })
        .required()
        .refine((data) => data.name === data.confirmName, {
            path: ['confirmName'],
            message: "Os nomes não coincidem",
        });
};

export type WifiNameData = {
    name: string;
    confirmName: string;
};