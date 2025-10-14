import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { db } from "@/db";
import { usersTable } from "@/db/schema";

export const POST = async (request: Request) => {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error("Stripe secret key not found");
  }
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    throw new Error("Stripe signature not found");
  }
  const text = await request.text();
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-09-30.clover",
  });

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      text,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new NextResponse("Invalid webhook signature", { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created": {
      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }
      const {
        id: subscription,
        metadata: { userId },
        customer,
      } = event.data.object as unknown as {
        customer: string;
        id: string;
        metadata: {
          userId: string;
        };
      };
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      if (!userId) {
        throw new Error("User ID not found");
      }
      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: subscription,
          stripeCustomerId: customer,
          plan: "essential",
        })
        .where(eq(usersTable.id, userId));
      break;
    }
    case "customer.subscription.deleted": {
      console.log("Subscription deleted:", event.data);

      if (!event.data.object.id) {
        throw new Error("Subscription ID not found");
      }
      const subscription = await stripe.subscriptions.retrieve(
        event.data.object.id,
      );
      if (!subscription) {
        throw new Error("Subscription not found");
      }
      const userId = subscription.metadata.userId;
      if (!userId) {
        throw new Error("User ID not found");
      }

      await db
        .update(usersTable)
        .set({
          stripeSubscriptionId: null,
          stripeCustomerId: null,
          plan: "free",
        })
        .where(eq(usersTable.id, userId));
      break;
    }
  }
  return NextResponse.json({
    received: true,
  });
};
