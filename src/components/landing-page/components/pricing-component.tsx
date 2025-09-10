"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconCheck,
  IconX,
  IconStar,
  IconArrowRight,
} from "@tabler/icons-react";

interface PricingFeature {
  id: string;
  text: string;
  included: boolean;
  highlight?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description?: string;
  price: string;
  currency: string;
  period: string;
  badge?: string;
  badgeColor?: "blue" | "green" | "purple" | "orange";
  features: PricingFeature[];
  ctaText: string;
  ctaUrl?: string;
  highlighted?: boolean;
}

interface PricingConfig {
  title?: string;
  subtitle?: string;
  layout: "cards" | "table" | "toggle";
  columns: 2 | 3 | 4;
  showComparison?: boolean;
  plans: PricingPlan[];
  className?: string;
}

interface PricingComponentProps {
  id: string;
  config: PricingConfig;
  onUpdate?: (config: PricingConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function PricingComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: PricingComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<PricingConfig>(config);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    setEditConfig(config);
  }, [config]);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handlePlanAdd = () => {
    const newPlan: PricingPlan = {
      id: `plan-${Date.now()}`,
      name: "New Plan",
      description: "Plan description",
      price: "99",
      currency: "IDR",
      period: "month",
      features: [
        {
          id: `feature-${Date.now()}`,
          text: "Sample feature",
          included: true,
        },
      ],
      ctaText: "Get Started",
    };
    setEditConfig({
      ...editConfig,
      plans: [...editConfig.plans, newPlan],
    });
  };

  const handlePlanUpdate = (
    planIndex: number,
    field: keyof PricingPlan,
    value: any
  ) => {
    const updatedPlans = editConfig.plans.map((plan, i) =>
      i === planIndex ? { ...plan, [field]: value } : plan
    );
    setEditConfig({ ...editConfig, plans: updatedPlans });
  };

  const handlePlanRemove = (planIndex: number) => {
    const updatedPlans = editConfig.plans.filter((_, i) => i !== planIndex);
    setEditConfig({ ...editConfig, plans: updatedPlans });
  };

  const handleFeatureAdd = (planIndex: number) => {
    const newFeature: PricingFeature = {
      id: `feature-${Date.now()}`,
      text: "New feature",
      included: true,
    };
    const updatedPlans = editConfig.plans.map((plan, i) =>
      i === planIndex
        ? { ...plan, features: [...plan.features, newFeature] }
        : plan
    );
    setEditConfig({ ...editConfig, plans: updatedPlans });
  };

  const handleFeatureUpdate = (
    planIndex: number,
    featureIndex: number,
    field: keyof PricingFeature,
    value: any
  ) => {
    const updatedPlans = editConfig.plans.map((plan, i) =>
      i === planIndex
        ? {
            ...plan,
            features: plan.features.map((feature, fi) =>
              fi === featureIndex ? { ...feature, [field]: value } : feature
            ),
          }
        : plan
    );
    setEditConfig({ ...editConfig, plans: updatedPlans });
  };

  const handleFeatureRemove = (planIndex: number, featureIndex: number) => {
    const updatedPlans = editConfig.plans.map((plan, i) =>
      i === planIndex
        ? {
            ...plan,
            features: plan.features.filter((_, fi) => fi !== featureIndex),
          }
        : plan
    );
    setEditConfig({ ...editConfig, plans: updatedPlans });
  };

  const getBadgeColor = (color?: string) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "purple":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "orange":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getResponsiveColumns = () => {
    if (previewMode === "mobile") return 1;
    if (previewMode === "tablet") return Math.min(config.columns, 2);
    return config.columns;
  };

  const renderCardsLayout = () => {
    const columns = getResponsiveColumns();
    const gridColsMap: Record<number, string> = {
      1: "grid-cols-1",
      2: "grid-cols-1 md:grid-cols-2",
      3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    };
    const gridCols = gridColsMap[columns] || "grid-cols-1";

    return (
      <div className={`grid ${gridCols} gap-6`}>
        {config.plans.map((plan, planIndex) => (
          <Card
            key={plan.id}
            className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
              plan.highlighted
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "hover:scale-105"
            }`}
          >
            {plan.badge && (
              <div className="absolute top-0 right-0">
                <Badge
                  className={`rounded-none rounded-bl-lg ${getBadgeColor(
                    plan.badgeColor
                  )}`}
                >
                  {plan.badge}
                </Badge>
              </div>
            )}

            <CardHeader className="text-center pb-6">
              <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
              {plan.description && (
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              )}
              <div className="mt-4">
                <div className="flex items-baseline justify-center">
                  <span className="text-sm text-muted-foreground">
                    {plan.currency}
                  </span>
                  <span className="text-4xl font-bold mx-1">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.period}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={`${plan.id}-feature-${featureIndex}`}
                    className="flex items-start gap-3"
                  >
                    {feature.included ? (
                      <IconCheck className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <IconX className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        feature.included
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400 line-through"
                      } ${feature.highlight ? "font-semibold" : ""}`}
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full mt-6 ${
                  plan.highlighted
                    ? "bg-primary hover:bg-primary/90"
                    : "variant-outline"
                }`}
                onClick={() => {
                  if (plan.ctaUrl) {
                    window.open(plan.ctaUrl, "_blank");
                  }
                }}
              >
                {plan.ctaText}
                <IconArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit Pricing Table</h3>
            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm">
                Save
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={editConfig.title || ""}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, title: e.target.value })
                    }
                    placeholder="Pricing title"
                  />
                </div>

                <div>
                  <Label htmlFor="layout">Layout</Label>
                  <Select
                    value={editConfig.layout}
                    onValueChange={(value: "cards" | "table" | "toggle") =>
                      setEditConfig({ ...editConfig, layout: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cards">Cards</SelectItem>
                      <SelectItem value="table">Table</SelectItem>
                      <SelectItem value="toggle">Toggle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Textarea
                  id="subtitle"
                  value={editConfig.subtitle || ""}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, subtitle: e.target.value })
                  }
                  placeholder="Pricing subtitle"
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="plans" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Pricing Plans</Label>
                <Button onClick={handlePlanAdd} size="sm" variant="outline">
                  <IconPlus className="h-4 w-4 mr-2" />
                  Add Plan
                </Button>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto">
                {editConfig.plans.map((plan, planIndex) => (
                  <Card key={plan.id} className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          Plan {planIndex + 1}
                        </span>
                        <Button
                          onClick={() => handlePlanRemove(planIndex)}
                          size="sm"
                          variant="destructive"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <Label>Plan Name</Label>
                          <Input
                            value={plan.name}
                            onChange={(e) =>
                              handlePlanUpdate(
                                planIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Basic Plan"
                          />
                        </div>
                        <div>
                          <Label>Price</Label>
                          <Input
                            value={plan.price}
                            onChange={(e) =>
                              handlePlanUpdate(
                                planIndex,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="99"
                          />
                        </div>
                        <div>
                          <Label>Currency</Label>
                          <Input
                            value={plan.currency}
                            onChange={(e) =>
                              handlePlanUpdate(
                                planIndex,
                                "currency",
                                e.target.value
                              )
                            }
                            placeholder="IDR"
                          />
                        </div>
                        <div>
                          <Label>Period</Label>
                          <Input
                            value={plan.period}
                            onChange={(e) =>
                              handlePlanUpdate(
                                planIndex,
                                "period",
                                e.target.value
                              )
                            }
                            placeholder="month"
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Input
                          value={plan.description || ""}
                          onChange={(e) =>
                            handlePlanUpdate(
                              planIndex,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Plan description"
                        />
                      </div>

                      {/* Features */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Features</Label>
                          <Button
                            onClick={() => handleFeatureAdd(planIndex)}
                            size="sm"
                            variant="outline"
                          >
                            <IconPlus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {plan.features.map((feature, featureIndex) => (
                            <div
                              key={`${plan.id}-edit-feature-${featureIndex}`}
                              className="flex items-center gap-2"
                            >
                              <Input
                                value={feature.text}
                                onChange={(e) =>
                                  handleFeatureUpdate(
                                    planIndex,
                                    featureIndex,
                                    "text",
                                    e.target.value
                                  )
                                }
                                placeholder="Feature text"
                                className="flex-1"
                              />
                              <Button
                                onClick={() =>
                                  handleFeatureUpdate(
                                    planIndex,
                                    featureIndex,
                                    "included",
                                    !feature.included
                                  )
                                }
                                size="sm"
                                variant={
                                  feature.included ? "default" : "outline"
                                }
                              >
                                {feature.included ? (
                                  <IconCheck className="h-3 w-3" />
                                ) : (
                                  <IconX className="h-3 w-3" />
                                )}
                              </Button>
                              <Button
                                onClick={() =>
                                  handleFeatureRemove(planIndex, featureIndex)
                                }
                                size="sm"
                                variant="destructive"
                              >
                                <IconTrash className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 ${config.className || ""}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(config.title || config.subtitle) && (
          <div className="text-center mb-12">
            {config.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {config.title}
              </h2>
            )}
            {config.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {config.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Pricing Content */}
        {renderCardsLayout()}

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit Pricing
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
