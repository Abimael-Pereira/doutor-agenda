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
    <Card className="mx-auto w-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="text-muted-foreground" />
          <CardTitle className="text-base">Médicos</CardTitle>
        </div>
      </div>

      <div className="space-y-4">
        {doctors.map((doctor) => (
          <div
            key={doctor.id}
            className="hover:bg-accent/50 flex items-center justify-between gap-4 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {doctor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm">{doctor.name}</span>
                <span className="text-muted-foreground text-sm">
                  {doctor.specialty}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground text-sm font-medium">
              {doctor.appointments} agend.
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopDoctors;
