"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconSettings } from "@tabler/icons-react";

interface ContentComponentProps {
  id: string;
  config: {
    content: string;
    textAlign: "left" | "center" | "right";
    backgroundColor: string;
  };
  onUpdate?: (config: any) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function ContentComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: ContentComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState(config);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditConfig(config);
    setIsEditing(false);
  };

  const getResponsiveClasses = () => {
    switch (previewMode) {
      case "mobile":
        return "px-4 py-8";
      case "tablet":
        return "px-6 py-12";
      default:
        return "px-8 py-16";
    }
  };

  return (
    <div className="relative group">
      {/* Edit Button */}
      {editable && onUpdate && (
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="secondary" size="sm">
                <IconSettings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Content</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="content-text">Content</Label>
                  <Textarea
                    id="content-text"
                    value={editConfig.content}
                    onChange={(e) =>
                      setEditConfig({ ...editConfig, content: e.target.value })
                    }
                    rows={6}
                    placeholder="Enter your content here..."
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>Save</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Content */}
      <div className={`bg-white dark:bg-gray-900 ${getResponsiveClasses()}`}>
        <div className="max-w-4xl mx-auto">
          <div
            className={`prose prose-lg dark:prose-invert max-w-none text-${config.textAlign}`}
            dangerouslySetInnerHTML={{
              __html: config.content.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      </div>
    </div>
  );
}
