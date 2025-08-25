"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

interface UnitPromoCardProps {
  promoText: string;
}

export function UnitPromoCard({ promoText }: UnitPromoCardProps) {
  if (!promoText) return null;

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-transparent dark:from-primary/20 dark:to-background/80 border-primary/30 overflow-hidden">
      <CardHeader className="pb-2 pt-4">
        <div className="flex items-center gap-2 text-primary">
          <Megaphone className="h-5 w-5" />
          <h3 className="font-semibold">Special Promo</h3>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="bg-background dark:bg-background/40 rounded-md p-3 shadow-sm">
          <p className="text-sm whitespace-pre-wrap">{promoText}</p>
        </div>
      </CardContent>
    </Card>
  );
}
