import { eq } from "drizzle-orm";

import { db } from "./index";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "./schema";

async function clearSeed() {
  console.log("Limpando dados de seed do banco de dados...");

  // ID da clínica criada manualmente
  const CLINIC_ID = "be7d550a-9413-4079-9ad5-45bdccf370ea";

  try {
    // Verificar se a clínica existe
    const clinic = await db.query.clinicsTable.findFirst({
      where: eq(clinicsTable.id, CLINIC_ID),
    });

    if (!clinic) {
      console.log("Clínica não encontrada.");
      return;
    }

    console.log(`Deletando agendamentos da clínica: ${clinic.name}...`);
    const deletedAppointments = await db
      .delete(appointmentsTable)
      .where(eq(appointmentsTable.clinicId, clinic.id))
      .returning();
    console.log(`${deletedAppointments.length} agendamentos deletados`);

    console.log(`Deletando pacientes da clínica...`);
    const deletedPatients = await db
      .delete(patientsTable)
      .where(eq(patientsTable.clinicId, clinic.id))
      .returning();
    console.log(`${deletedPatients.length} pacientes deletados`);

    console.log(`Deletando médicos da clínica...`);
    const deletedDoctors = await db
      .delete(doctorsTable)
      .where(eq(doctorsTable.clinicId, clinic.id))
      .returning();
    console.log(`${deletedDoctors.length} médicos deletados`);

    console.log("\nLimpeza concluída com sucesso!");
    console.log(
      "ℹO usuário e a clínica não foram removidos (criados manualmente).",
    );
  } catch (error) {
    console.error("Erro ao limpar dados de seed:", error);
    throw error;
  }
}

// Executar limpeza
clearSeed()
  .then(() => {
    console.log("\nProcesso finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nFalha no processo de limpeza:", error);
    process.exit(1);
  });
