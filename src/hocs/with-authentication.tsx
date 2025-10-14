import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

const WithAuthentication = async ({
  children,
  mustHaveEssentialPlan = false,
  mustHaveClinic = false,
}: {
  children: React.ReactNode;
  mustHaveEssentialPlan?: boolean;
  mustHaveClinic?: boolean;
}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/authentication");
  }
  if (mustHaveEssentialPlan && session.user.plan === "free") {
    redirect("/new-subscription");
  }
  if (mustHaveClinic && !session.user.clinic.id) {
    redirect("/clinic-form");
  }
  return children;
};

export default WithAuthentication;
