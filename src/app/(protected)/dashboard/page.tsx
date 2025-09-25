import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/db";
import { usersToClinicsTable } from "@/db/schema";
import { auth } from "@/lib/auth";

import SignOutButton from "./_components/sign-out-button";

const DashboardPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/authentication");
  }

  const clinics = await db.query.usersToClinicsTable.findMany({
    where: eq(usersToClinicsTable.userId, session?.user.id),
  });

  if (clinics.length === 0) {
    redirect("/clinic-form");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
      {session ? (
        <>
          <p className="text-lg">
            Bem-vindo, {session.user.name}, {session.user.email}!
          </p>
          <SignOutButton />
        </>
      ) : (
        <p className="text-lg">Você não está autenticado.</p>
      )}
    </div>
  );
};

export default DashboardPage;
