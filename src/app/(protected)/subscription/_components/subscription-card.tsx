import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface PricingCardProps {
  active: boolean;
  planName: string;
  description: string;
  price: string;
  priceUnit: string;
  features: string[];
}

const PricingCard = ({
  active,
  planName,
  description,
  price,
  priceUnit,
  features,
}: PricingCardProps) => {
  return (
    <Card className="max-w-[280px] space-y-3">
      <CardHeader className="gap-3">
        <CardTitle>{planName}</CardTitle>
        {active && (
          <CardAction>
            <Badge className="text-primary bg-primary/10 hover:bg-teal/90">
              Atual
            </Badge>
          </CardAction>
        )}
        <CardDescription>{description}</CardDescription>

        <div>
          <span className="text-foreground text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground text-sm"> {priceUnit}</span>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="space-y-6">
        <div className="space-y-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle2 className="text-primary h-5 w-5 flex-shrink-0" />
              <span className="text-foreground text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </CardContent>

      <Separator />

      <CardFooter>
        <Button variant="outline" className="w-full bg-transparent">
          {active ? "Gerenciar assinatura" : "Fazer assinatura"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
