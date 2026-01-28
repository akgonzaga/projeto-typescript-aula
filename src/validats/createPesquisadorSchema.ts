import { z } from "zod";

export const createPesquisadorSchema = z.object({
    nome: z.string()
        .min(1, "Nome é obrigatório"),
    email: z.string()
        .email("Formato de email inválido")
        .min(1, "E-mail é obrigatório"),
    senha: z.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres"),
    especialidade: z.string()
        .min(1, "Especialidade é obrigatória"),

    titulacao: z.enum(["Graduação", "Especialização", "Mestrado", "Doutorado"], {
    message: "Titulação inválida",
    }),

    matricula: z.string()
        .min(1, "Matrícula é obrigatória"),
    linhaPesquisa: z.string()
        .optional(),
    dataNascimento: z.coerce.date().refine((data) => {
        const hoje = new Date();
        const idade = hoje.getFullYear() - data.getFullYear();
        const mes = hoje.getMonth() - data.getMonth();
        if (mes < 0 || (mes === 0 && hoje.getDate() < data.getDate())) {
            return idade - 1 >= 18;
        }
        return idade >= 18;
    }, "O pesquisador deve ter no mínimo 18 anos completos"),
});