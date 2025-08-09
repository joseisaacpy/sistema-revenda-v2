// Importa a biblioteca pra lidar com formulários
import { z } from "zod";
// Define o schema da validação com zod
const veiculoSchema = z.object({
  chassi: z.string().min(1, "Chassi inválido").max(17, "Chassi inválido"),
  renavam: z.string().min(1, "Renavam inválido").max(8, "Renavam inválido"),
  placa: z.string().min(1, "Placa inválida").max(7, "Placa inválida"),
  marca: z.string().min(1, "Marca inválida").max(7, "Marca inválida"),
  modelo: z.string().min(1, "Modelo inválido").max(20, "Modelo inválido"),
  ano_modelo: z
    .number({ invalid_type_error: "Ano Modelo deve ser número" })
    .int()
    .min(1900, "Ano Modelo inválido")
    .max(new Date().getFullYear(), "Ano Modelo inválido"),
  combustivel: z
    .string()
    .min(1, "Combustível inválido")
    .max(20, "Combustível inválido"),
  cor: z.string().min(1, "Cor inválida").max(20, "Cor inválida"),
  km: z
    .number({ invalid_type_error: "Quilometragem deve ser número" })
    .min(0, "Quilometragem inválida"),
  valor_compra: z
    .number({ invalid_type_error: "Valor de Compra deve ser número" })
    .min(0, "Valor de Compra inválido"),
  data_compra: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"), // Formato YYYY-MM-DD
  fornecedor: z
    .string()
    .min(1, "Fornecedor inválido")
    .max(30, "Fornecedor inválido"),
  cpf_cnpj_fornecedor: z
    .string()
    .regex(/^\d{11}$|^\d{14}$/, "CPF ou CNPJ inválido"),
});

export default veiculoSchema;
