import {
  Activity,
  Baby,
  Bone,
  Brain,
  Eye,
  Hand,
  Heart,
  HospitalIcon,
  Stethoscope,
} from "lucide-react";

import { Card, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TopSpecialtiesProps {
  topSpecialties: {
    specialty: string;
    appointments: number;
  }[];
}

const getSpecialtyIcon = (specialty: string) => {
  const specialtyLower = specialty.toLowerCase();

  if (specialtyLower.includes("cardiolog")) return Heart;
  if (
    specialtyLower.includes("ginecolog") ||
    specialtyLower.includes("obstetri")
  )
    return Baby;
  if (specialtyLower.includes("pediatr")) return Activity;
  if (specialtyLower.includes("dermatolog")) return Hand;
  if (
    specialtyLower.includes("ortoped") ||
    specialtyLower.includes("traumatolog")
  )
    return Bone;
  if (specialtyLower.includes("oftalmolog")) return Eye;
  if (specialtyLower.includes("neurolog")) return Brain;

  return Stethoscope;
};

const TopSpecialties = ({ topSpecialties }: TopSpecialtiesProps) => {
  const maxAppointments = Math.max(
    ...topSpecialties.map((s) => s.appointments),
  );
  return (
    <Card className="mx-auto w-full p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <HospitalIcon className="text-muted-foreground h-5 w-5" />
          <CardTitle className="text-sm sm:text-base">Especialidades</CardTitle>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {topSpecialties.map((specialty) => {
          const Icon = getSpecialtyIcon(specialty.specialty);
          const progressValue =
            (specialty.appointments / maxAppointments) * 100;
          return (
            <div key={specialty.specialty} className="flex items-center gap-2">
              <div className="bg-primary/10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10">
                <Icon className="text-primary h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div className="flex w-full min-w-0 flex-1 flex-col justify-center">
                <div className="flex w-full justify-between">
                  <h3 className="truncate text-xs sm:text-sm">
                    {specialty.specialty}
                  </h3>
                  <div className="text-right">
                    <span className="text-muted-foreground flex-shrink-0 text-xs font-medium sm:text-sm">
                      {specialty.appointments} agend.
                    </span>
                  </div>
                </div>
                <Progress value={progressValue} className="w-full" />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default TopSpecialties;
