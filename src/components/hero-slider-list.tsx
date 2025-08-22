"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  IconGripVertical,
  IconEdit,
  IconTrash,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { HeroSlider as HeroSliderType } from "@/types/hero-slider";
import {
  updateHeroSlidersOrder,
  deleteHeroSlider,
  updateHeroSlider,
} from "@/lib/hero-slider-actions";
import { useSweetAlert } from "@/hooks/use-sweet-alert";

interface HeroSliderListProps {
  initialSliders: HeroSliderType[];
  onEditAction: (sliderId: string) => void;
}

export function HeroSliderList({
  initialSliders,
  onEditAction,
}: HeroSliderListProps) {
  const [sliders, setSliders] = useState<HeroSliderType[]>(initialSliders);
  const [isReordering, setIsReordering] = useState(false);
  const { showSuccess, showError, showConfirmation } = useSweetAlert();

  // DnD sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end to reorder sliders
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSliders((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });

      // Update order in the database
      const sliderIds = sliders.map((slider) => slider.id);
      try {
        setIsReordering(true);
        const result = await updateHeroSlidersOrder(sliderIds);
        if (!result.success) {
          toast.error("Failed to update slider order");
        }
      } catch (error) {
        console.error("Error updating slider order:", error);
        toast.error("An error occurred while updating order");
      } finally {
        setIsReordering(false);
      }
    }
  };

  // Toggle slider active status
  const toggleSliderStatus = async (slider: HeroSliderType) => {
    try {
      const formData = new FormData();
      formData.append("title", slider.title);
      formData.append("subtitle", slider.subtitle || "");
      formData.append("order", slider.order.toString());
      formData.append("isActive", (!slider.isActive).toString());
      formData.append("desktopImage", slider.desktopImage);
      formData.append("mobileImage", slider.mobileImage);
      formData.append("linkUrl", slider.linkUrl || "");
      formData.append("linkText", slider.linkText || "");

      const result = await updateHeroSlider(slider.id, formData);

      if (result.success) {
        setSliders(
          sliders.map((s) =>
            s.id === slider.id ? { ...s, isActive: !s.isActive } : s
          )
        );

        toast.success(
          `Slider ${!slider.isActive ? "activated" : "deactivated"}`
        );
      } else {
        toast.error(result.message || "Failed to update slider");
      }
    } catch (error) {
      console.error("Error toggling slider status:", error);
      toast.error("An error occurred");
    }
  };

  // Handle slider deletion
  const handleDeleteSlider = async (sliderId: string) => {
    try {
      const confirmation = await showConfirmation(
        "Delete Hero Slider",
        "Are you sure you want to delete this slider? This action cannot be undone.",
        "Yes, delete it!"
      );

      if (confirmation.isConfirmed) {
        const result = await deleteHeroSlider(sliderId);

        if (result.success) {
          setSliders(sliders.filter((slider) => slider.id !== sliderId));
          showSuccess("Hero slider deleted successfully!");
        } else {
          showError(result.message || "Failed to delete slider");
        }
      }
    } catch (error) {
      console.error("Error deleting slider:", error);
      showError("An error occurred while deleting the slider");
    }
  };

  if (sliders.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          No hero sliders found. Create your first one!
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sliders.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {sliders.map((slider) => (
            <SortableSliderItem
              key={slider.id}
              slider={slider}
              onEdit={() => onEditAction(slider.id)}
              onDelete={() => handleDeleteSlider(slider.id)}
              onToggleStatus={() => toggleSliderStatus(slider)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

interface SortableSliderItemProps {
  slider: HeroSliderType;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}

function SortableSliderItem({
  slider,
  onEdit,
  onDelete,
  onToggleStatus,
}: SortableSliderItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: slider.id });

  // Fix hydration error by ensuring client-side only rendering for transform styles
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Only apply transform styles after component is mounted on client
  const style = isMounted ? {
    transform: CSS.Transform.toString(transform),
    transition,
  } : {};

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      className="touch-none"
      suppressHydrationWarning={true}
    >
      <Card>
        <CardContent className="p-0">
          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center gap-4 p-4">
            <div
              {...listeners}
              className="cursor-grab hover:bg-muted rounded-md p-2"
            >
              <IconGripVertical className="text-muted-foreground h-5 w-5" />
            </div>

            <div className="flex-shrink-0 h-16 w-24 relative overflow-hidden rounded-md">
              {slider.desktopImage && (
                <Image
                  src={slider.desktopImage}
                  alt={slider.title || "Slider image"}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold truncate">{slider.title}</h3>
              {slider.subtitle && (
                <p className="text-sm text-muted-foreground truncate">
                  {slider.subtitle}
                </p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={
                    slider.isActive
                      ? "text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {slider.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Order: {slider.order}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onToggleStatus}>
                {slider.isActive ? (
                  <IconEyeOff className="h-4 w-4" />
                ) : (
                  <IconEye className="h-4 w-4" />
                )}
              </Button>

              <Button variant="ghost" size="icon" onClick={onEdit}>
                <IconEdit className="h-4 w-4" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Hero Slider</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this slider? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden p-4 space-y-3">
            {/* Header with drag handle and image */}
            <div className="flex items-center gap-3">
              <div
                {...listeners}
                className="cursor-grab hover:bg-muted rounded-md p-2"
              >
                <IconGripVertical className="text-muted-foreground h-4 w-4" />
              </div>
              
              <div className="flex-shrink-0 h-12 w-16 relative overflow-hidden rounded-md">
                {slider.desktopImage && (
                  <Image
                    src={slider.desktopImage}
                    alt={slider.title || "Slider image"}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{slider.title}</h3>
                {slider.subtitle && (
                  <p className="text-xs text-muted-foreground truncate">
                    {slider.subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Status and Order */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className={
                    slider.isActive
                      ? "text-xs px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "text-xs px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                  }
                >
                  {slider.isActive ? "Active" : "Inactive"}
                </span>
                <span className="text-xs text-muted-foreground">
                  Order: {slider.order}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onToggleStatus}
                className="h-8 w-8 p-0"
              >
                {slider.isActive ? (
                  <IconEyeOff className="h-3.5 w-3.5" />
                ) : (
                  <IconEye className="h-3.5 w-3.5" />
                )}
              </Button>

              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onEdit}
                className="h-8 w-8 p-0"
              >
                <IconEdit className="h-3.5 w-3.5" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <IconTrash className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="mx-4 max-w-sm">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Hero Slider</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this slider? This action
                      cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                    <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onDelete} className="w-full sm:w-auto">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
