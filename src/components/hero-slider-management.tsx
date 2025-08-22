"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { HeroSliderForm } from "@/components/hero-slider-form";
import { HeroSliderList } from "@/components/hero-slider-list";
import { getHeroSliders } from "@/lib/hero-slider-actions";
import { HeroSlider } from "@/types/hero-slider";

interface HeroSliderManagementProps {
  initialSliders: any[]; // Using any to avoid type issues with the server response
}

export function HeroSliderManagement({
  initialSliders,
}: HeroSliderManagementProps) {
  const [activeTab, setActiveTab] = useState("list");
  const [editingSliderId, setEditingSliderId] = useState<string | null>(null);
  const [sliders, setSliders] = useState<any[]>(initialSliders);

  // Find the slider being edited
  const editingSlider = editingSliderId
    ? sliders.find((slider) => slider.id === editingSliderId)
    : undefined;

  // Handle edit button click
  const handleEdit = (sliderId: string) => {
    setEditingSliderId(sliderId);
    setActiveTab("form");
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    // Refresh the sliders list
    const refreshSliders = async () => {
      const { data = [], success } = await getHeroSliders();
      if (success) {
        setSliders(data);
      }
    };

    refreshSliders();

    // Return to list view after editing
    if (editingSliderId) {
      setEditingSliderId(null);
      setActiveTab("list");
    }
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingSliderId(null);
    setActiveTab("list");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Hero Slider Management</h1>

        {activeTab === "list" ? (
          <Button 
            onClick={() => setActiveTab("form")}
            className="w-full sm:w-auto"
          >
            Add New Slider
          </Button>
        ) : (
          <Button variant="outline" onClick={handleCancelEdit} className="w-full sm:w-auto">
            Cancel
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-flex">
          <TabsTrigger value="list">Slider List</TabsTrigger>
          <TabsTrigger value="form">
            {editingSliderId ? "Edit Slider" : "Add Slider"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-6">
          <HeroSliderList initialSliders={sliders} onEditAction={handleEdit} />
        </TabsContent>

        <TabsContent value="form">
          <HeroSliderForm
            initialData={editingSlider}
            onSuccess={handleFormSuccess}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
