// Importa biblioteca pra lidar com formulários
import { z } from "zod";

// Define o schema da validação com zod
const clienteSchema = z.object({
  cpf_cnpj: z.string().regex(/^\d{11}$|^\d{14}$/, "CPF ou CNPJ inválido"), // 11 dígitos (CPF) ou 14 (CNPJ) sem pontos ou traços

  pessoa: z
    .string()
    .min(1, "Selecione uma opção")
    .max(1, "Selecione uma opção"), // Ex: F, M, J

  sexo: z.string().min(1, "Selecione uma opção").max(1, "Selecione uma opção"), // Ex: M ou F

  nome: z
    .string()
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres"),

  telefone_celular: z.string().regex(/^\d{10,15}$/, "Telefone inválido"), // Aceita 10 a 15 dígitos

  telefone_comercial: z.string().regex(/^\d{10,15}$/, "Telefone inválido"),

  rg: z.string().regex(/^\d{9}$/, "RG inválido"), // 9 dígitos

  ie: z.string().regex(/^\d{8}$/, "Inscrição Estadual inválida"), // 8 dígitos

  data_nascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"), // Formato YYYY-MM-DD

  email: z.string().email("E-mail inválido"),

  cep: z.string().regex(/^\d{8}$/, "CEP inválido"), // Apenas números

  rua: z.string().min(1, "Rua inválida"),
  numero: z.string().min(1, "Número inválido"),
  bairro: z.string().min(1, "Bairro inválido"),
  estado: z.string().min(2, "Estado inválido"),
  cidade: z.string().min(1, "Cidade inválida"),

  complemento: z.string().optional(), // Opcional agora
});

export default clienteSchema;
