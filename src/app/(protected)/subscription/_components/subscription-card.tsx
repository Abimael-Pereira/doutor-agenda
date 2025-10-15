"use client";

import { loadStripe } from "@stripe/stripe-js";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

import { createStripeCheckout } from "@/actions/create-stripe-checkout";
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
  userEmail?: string;
  buttonPlaceholder?: string;
}

const PricingCard = ({
  active,
  planName,
  description,
  price,
  priceUnit,
  features,
  userEmail,
  buttonPlaceholder,
}: PricingCardProps) => {
  const router = useRouter();

  const createStripeCheckoutAction = useAction(createStripeCheckout, {
    onSuccess: async ({ data }) => {
      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        throw new Error("Stripe publishable key not found");
      }
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      );
      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      if (!data.sessionId) {
        throw new Error("Session ID not found");
      }

      await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
    },
  });

  const handleSubscribeClick = () => {
    createStripeCheckoutAction.execute();
  };

  const handleManagePlanClick = () => {
    router.push(
      `${process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL}/?prefilled_email=${userEmail}`,
    );
  };
  return (
    <Card className="flex h-full max-w-[280px] flex-col space-y-3">
      <CardHeader className="min-h-[9rem] gap-3">
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

      <CardContent className="flex-1 space-y-6">
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
        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={active ? handleManagePlanClick : handleSubscribeClick}
          disabled={
            createStripeCheckoutAction.isExecuting || !!buttonPlaceholder
          }
        >
          {createStripeCheckoutAction.isExecuting && (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          )}
          {buttonPlaceholder ||
            (active ? "Gerenciar assinatura" : "Fazer assinatura")}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PricingCard;
