import dayjs from "dayjs";
import { eq } from "drizzle-orm";

import { db } from "./index";
import {
  appointmentsTable,
  clinicsTable,
  doctorsTable,
  patientsTable,
} from "./schema";

async function seed() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Dados do usuário e clínica criados manualmente
  const CLINIC_ID = "be7d550a-9413-4079-9ad5-45bdccf370ea";
  const SEED_EMAIL = "admin@douttoragenda.com";
  const SEED_PASSWORD = "admin123";

  try {
    // 1. Verificar se a clínica existe
    const clinic = await db.query.clinicsTable.findFirst({
      where: eq(clinicsTable.id, CLINIC_ID),
    });

    if (!clinic) {
      console.error("Clínica não encontrada! Verifique o ID da clínica.");
      process.exit(1);
    }

    console.log("Clínica encontrada:", clinic.name);

    // 2. Buscar ou criar médicos
    let doctors = await db.query.doctorsTable.findMany({
      where: eq(doctorsTable.clinicId, clinic.id),
    });

    if (doctors.length === 0) {
      console.log("Criando médicos...");

      const doctorsData = [
        {
          name: "Dr. João Silva",
          specialty: "Cardiologia",
          appointmentPriceInCents: 25000, // R$ 250,00
          availableFromWeekDay: 1, // Segunda
          availableToWeekDay: 5, // Sexta
          availableFromTime: "10:00:00",
          availableToTime: "17:00:00",
        },
        {
          name: "Dra. Maria Santos",
          specialty: "Dermatologia",
          appointmentPriceInCents: 20000, // R$ 200,00
          availableFromWeekDay: 1, // Segunda
          availableToWeekDay: 5, // Sexta
          availableFromTime: "09:00:00",
          availableToTime: "18:00:00",
        },
        {
          name: "Dr. Pedro Oliveira",
          specialty: "Ortopedia",
          appointmentPriceInCents: 30000, // R$ 300,00
          availableFromWeekDay: 2, // Terça
          availableToWeekDay: 6, // Sábado
          availableFromTime: "10:00:00",
          availableToTime: "16:00:00",
        },
      ];

      doctors = await db
        .insert(doctorsTable)
        .values(
          doctorsData.map((doctor) => ({
            ...doctor,
            clinicId: clinic.id,
          })),
        )
        .returning();

      console.log(`${doctors.length} médicos criados`);
    }

    // 3. Buscar ou criar pacientes
    let patients = await db.query.patientsTable.findMany({
      where: eq(patientsTable.clinicId, clinic.id),
    });

    if (patients.length === 0) {
      console.log("Criando pacientes...");

      const patientsData = [
        {
          name: "Ana Costa",
          email: "ana.costa@email.com",
          phoneNumber: "(11) 98765-4321",
          sex: "female" as const,
        },
        {
          name: "Carlos Souza",
          email: "carlos.souza@email.com",
          phoneNumber: "(11) 98765-4322",
          sex: "male" as const,
        },
        {
          name: "Beatriz Lima",
          email: "beatriz.lima@email.com",
          phoneNumber: "(11) 98765-4323",
          sex: "female" as const,
        },
        {
          name: "Daniel Alves",
          email: "daniel.alves@email.com",
          phoneNumber: "(11) 98765-4324",
          sex: "male" as const,
        },
        {
          name: "Fernanda Rocha",
          email: "fernanda.rocha@email.com",
          phoneNumber: "(11) 98765-4325",
          sex: "female" as const,
        },
        {
          name: "Gabriel Martins",
          email: "gabriel.martins@email.com",
          phoneNumber: "(11) 98765-4326",
          sex: "male" as const,
        },
        {
          name: "Helena Ferreira",
          email: "helena.ferreira@email.com",
          phoneNumber: "(11) 98765-4327",
          sex: "female" as const,
        },
        {
          name: "Igor Pereira",
          email: "igor.pereira@email.com",
          phoneNumber: "(11) 98765-4328",
          sex: "male" as const,
        },
        {
          name: "Juliana Barbosa",
          email: "juliana.barbosa@email.com",
          phoneNumber: "(11) 98765-4329",
          sex: "female" as const,
        },
        {
          name: "Lucas Mendes",
          email: "lucas.mendes@email.com",
          phoneNumber: "(11) 98765-4330",
          sex: "male" as const,
        },
      ];

      patients = await db
        .insert(patientsTable)
        .values(
          patientsData.map((patient) => ({
            ...patient,
            clinicId: clinic.id,
          })),
        )
        .returning();

      console.log(`${patients.length} pacientes criados`);
    }

    // 4. Criar agendamentos (10 dias para trás e 10 dias para frente)
    console.log("Criando agendamentos...");

    const appointments = [];
    const startDate = dayjs().subtract(10, "days");
    const endDate = dayjs().add(10, "days");

    // Função auxiliar para gerar horários de agendamento
    const generateTimeSlots = (fromTime: string, toTime: string): string[] => {
      const slots: string[] = [];
      const [fromHour] = fromTime.split(":").map(Number);
      const [toHour] = toTime.split(":").map(Number);

      for (let hour = fromHour; hour < toHour; hour++) {
        slots.push(`${hour.toString().padStart(2, "0")}:00:00`);
        slots.push(`${hour.toString().padStart(2, "0")}:30:00`);
      }

      return slots;
    };

    // Gerar agendamentos para cada dia
    for (
      let date = startDate;
      date.isBefore(endDate) || date.isSame(endDate, "day");
      date = date.add(1, "day")
    ) {
      const dayOfWeek = date.day(); // 0 = Domingo, 1 = Segunda, etc.

      // Para cada médico
      for (const doctor of doctors) {
        // Verificar se o médico trabalha neste dia
        if (
          dayOfWeek >= doctor.availableFromWeekDay &&
          dayOfWeek <= doctor.availableToWeekDay
        ) {
          // Gerar slots de horário
          const timeSlots = generateTimeSlots(
            doctor.availableFromTime,
            doctor.availableToTime,
          );

          // Criar alguns agendamentos aleatórios (não todos os slots)
          const numAppointments = Math.floor(Math.random() * 4) + 1; // 1 a 4 agendamentos por dia

          for (let i = 0; i < numAppointments && i < timeSlots.length; i++) {
            const randomSlotIndex = Math.floor(
              Math.random() * timeSlots.length,
            );
            const timeSlot = timeSlots[randomSlotIndex];

            // Pegar paciente aleatório
            const randomPatient =
              patients[Math.floor(Math.random() * patients.length)];

            const [hour, minute] = timeSlot.split(":").map(Number);
            const appointmentDate = date.hour(hour).minute(minute).second(0);

            appointments.push({
              patientId: randomPatient.id,
              doctorId: doctor.id,
              clinicId: clinic.id,
              date: appointmentDate.toDate(),
              appointmentPriceInCents: doctor.appointmentPriceInCents,
            });
          }
        }
      }
    }

    // Inserir agendamentos no banco
    if (appointments.length > 0) {
      await db.insert(appointmentsTable).values(appointments);
      console.log(`${appointments.length} agendamentos criados`);
    }

    console.log("\nSeed concluído com sucesso!");
    console.log(`Resumo:`);
    console.log(`   - Clínica: ${clinic.name}`);
    console.log(`   - ${doctors.length} médicos`);
    console.log(`   - ${patients.length} pacientes`);
    console.log(`   - ${appointments.length} agendamentos`);
    console.log(`\nCredenciais de acesso:`);
    console.log(`   Email: ${SEED_EMAIL}`);
    console.log(`   Senha: ${SEED_PASSWORD}`);
  } catch (error) {
    console.error("Erro ao executar seed:", error);
    throw error;
  }
}

// Executar seed
seed()
  .then(() => {
    console.log("\nProcesso finalizado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\nFalha no processo de seed:", error);
    process.exit(1);
  });
