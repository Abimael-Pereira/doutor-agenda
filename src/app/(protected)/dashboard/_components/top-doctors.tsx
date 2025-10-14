import { Stethoscope } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";

interface TopDoctorsProps {
  doctors: {
    id: string;
    name: string;
    avatarImageUrl: string | null;
    specialty: string;
    appointments: number;
  }[];
}

const TopDoctors = ({ doctors }: TopDoctorsProps) => {
  return (
    <Card className="mx-auto w-full p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-muted-foreground h-5 w-5" />
          <CardTitle className="text-sm sm:text-base">Médicos</CardTitle>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="hover:bg-accent/50 flex items-center justify-between gap-3 rounded-lg transition-colors sm:gap-4"
          >
            <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <Avatar className="h-8 w-8 flex-shrink-0 sm:h-10 sm:w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs sm:text-sm">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-xs sm:text-sm">
                  {doctor.name}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {doctor.specialty}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground flex-shrink-0 text-xs font-medium sm:text-sm">
              {doctor.appointments} agend.
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopDoctors;
