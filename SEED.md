# Script de Seed do Banco de Dados

Este script popula o banco de dados com dados de exemplo para desenvolvimento e testes.

## 📋 Pré-requisitos

Antes de executar o seed, você precisa ter:

- **Usuário criado** no sistema
- **Clínica criada** e associada ao usuário

## 📊 Dados necessários

Configure no arquivo `src/db/seed.ts`:

- **CLINIC_ID**: ID da clínica (UUID)
- **SEED_EMAIL**: Email do usuário
- **SEED_PASSWORD**: Senha do usuário (apenas para exibição no resumo)

### Exemplo:

```typescript
const CLINIC_ID = "be7d550a-9413-4079-9ad5-45bdccf370ea";
const SEED_EMAIL = "admin@douttoragenda.com";
const SEED_PASSWORD = "admin123";
```

## 📋 O que o script cria?

### 1. **Médicos** (3 médicos)

- **Dr. João Silva** - Cardiologia
  - Consulta: R$ 250,00
  - Horário: Segunda a Sexta, 08:00 - 17:00
- **Dra. Maria Santos** - Dermatologia
  - Consulta: R$ 200,00
  - Horário: Segunda a Sexta, 09:00 - 18:00
- **Dr. Pedro Oliveira** - Ortopedia
  - Consulta: R$ 300,00
  - Horário: Terça a Sábado, 08:00 - 16:00

### 2. **Pacientes** (10 pacientes)

- Ana Costa, Carlos Souza, Beatriz Lima, Daniel Alves, Fernanda Rocha, Gabriel Martins, Helena Ferreira, Igor Pereira, Juliana Barbosa, Lucas Mendes

### 3. **Agendamentos**

- Agendamentos distribuídos entre **10 dias atrás** e **10 dias à frente**
- 1 a 4 agendamentos por dia por médico
- Respeitando os horários de disponibilidade de cada médico
- Respeitando os dias da semana de cada médico

## 🚀 Como executar

### Opção 1: Usando npm

```bash
npm run db:seed
```

### Opção 2: Diretamente com tsx

```bash
npx tsx src/db/seed.ts
```

## ⚠️ Importante

- O script é **idempotente**: Pode ser executado múltiplas vezes sem duplicar dados
- Se os médicos e pacientes já existirem, o script irá reutilizá-los
- Os agendamentos são sempre recriados baseados no período de 10 dias para trás e 10 dias para frente da data atual
- **Certifique-se** de configurar o `CLINIC_ID` correto antes de executar

## 📊 Exemplo de saída

```
🌱 Iniciando seed do banco de dados...
✅ Clínica encontrada: Saúde Mais
👨‍⚕️ Criando médicos...
✅ 3 médicos criados
🧑‍🤝‍🧑 Criando pacientes...
✅ 10 pacientes criados
📅 Criando agendamentos...
✅ 105 agendamentos criados

🎉 Seed concluído com sucesso!
📊 Resumo:
   - Clínica: Saúde Mais
   - 3 médicos
   - 10 pacientes
   - 105 agendamentos

🔐 Credenciais de acesso:
   Email: admin@douttoragenda.com
   Senha: admin123

✅ Processo finalizado
```

## 🔧 Personalização

Para personalizar os dados, edite o arquivo `src/db/seed.ts`:

- **Altere o CLINIC_ID** para apontar para sua clínica
- Modifique os arrays `doctorsData` e `patientsData` para adicionar/remover registros
- Ajuste o período de agendamentos alterando `startDate` e `endDate`
- Modifique a quantidade de agendamentos por dia alterando `numAppointments`

## 🗑️ Limpeza

Para limpar os dados de seed do banco de dados:

### Opção 1: Usando npm

```bash
npm run db:clear-seed
```

### Opção 2: Diretamente com tsx

```bash
npx tsx src/db/clear-seed.ts
```

Este comando irá deletar:

- Todos os agendamentos da clínica
- Todos os pacientes da clínica
- Todos os médicos da clínica

**Nota:** O usuário e a clínica não serão removidos (criados manualmente).
