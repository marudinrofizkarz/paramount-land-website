"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  IconEdit,
  IconPlus,
  IconTrash,
  IconSearch,
  IconChevronDown,
} from "@tabler/icons-react";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQConfig {
  title?: string;
  subtitle?: string;
  searchable?: boolean;
  categories?: string[];
  items: FAQItem[];
  allowMultiple?: boolean;
  className?: string;
}

interface FAQComponentProps {
  id: string;
  config: FAQConfig;
  onUpdate?: (config: FAQConfig) => void;
  previewMode: "desktop" | "tablet" | "mobile";
  editable?: boolean;
}

export function FAQComponent({
  id,
  config,
  onUpdate,
  previewMode,
  editable = true,
}: FAQComponentProps) {
  // Normalize config to ensure all properties are defined
  const normalizedConfig: FAQConfig = {
    title: config.title || "",
    subtitle: config.subtitle || "",
    searchable: config.searchable ?? true,
    categories: config.categories || [],
    items: config.items || [],
    allowMultiple: config.allowMultiple ?? false,
    className: config.className || "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editConfig, setEditConfig] = useState<FAQConfig>(normalizedConfig);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<string[]>([]);

  useEffect(() => {
    setEditConfig(normalizedConfig);
  }, [config]);

  const handleSave = () => {
    onUpdate?.(editConfig);
    setIsEditing(false);
  };

  const handleItemAdd = () => {
    const newItem: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "New Question",
      answer: "Answer content here",
      category: editConfig.categories?.[0] || undefined,
    };
    setEditConfig({
      ...editConfig,
      items: [...editConfig.items, newItem],
    });
  };

  const handleItemUpdate = (
    index: number,
    field: keyof FAQItem,
    value: string
  ) => {
    const updatedItems = editConfig.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setEditConfig({ ...editConfig, items: updatedItems });
  };

  const handleItemRemove = (index: number) => {
    const updatedItems = editConfig.items.filter((_, i) => i !== index);
    setEditConfig({ ...editConfig, items: updatedItems });
  };

  const handleCategoryAdd = () => {
    const newCategory = `Category ${(editConfig.categories?.length || 0) + 1}`;
    setEditConfig({
      ...editConfig,
      categories: [...(editConfig.categories || []), newCategory],
    });
  };

  const handleCategoryUpdate = (index: number, value: string) => {
    const updatedCategories = editConfig.categories?.map((cat, i) =>
      i === index ? value : cat
    );
    setEditConfig({ ...editConfig, categories: updatedCategories });
  };

  const handleCategoryRemove = (index: number) => {
    const updatedCategories = editConfig.categories?.filter(
      (_, i) => i !== index
    );
    setEditConfig({ ...editConfig, categories: updatedCategories });
  };

  const categories = normalizedConfig.categories || [];
  const uniqueCategories = [
    "all",
    ...new Set([
      ...categories,
      ...normalizedConfig.items.map((item) => item.category).filter(Boolean),
    ]),
  ];

  // Filter FAQ items based on search and category
  const filteredItems = normalizedConfig.items.filter((item) => {
    const matchesSearch =
      !normalizedConfig.searchable ||
      !searchTerm ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      !item.category ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  if (editable && isEditing) {
    return (
      <div className="border-2 border-dashed border-primary p-6 rounded-lg bg-blue-50/50 dark:bg-blue-950/50">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Edit FAQ</h3>
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

          {/* General Settings */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editConfig.title || ""}
                  onChange={(e) =>
                    setEditConfig({ ...editConfig, title: e.target.value })
                  }
                  placeholder="FAQ title"
                />
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editConfig.searchable || false}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        searchable: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Searchable</span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editConfig.allowMultiple || false}
                    onChange={(e) =>
                      setEditConfig({
                        ...editConfig,
                        allowMultiple: e.target.checked,
                      })
                    }
                    className="rounded"
                  />
                  <span className="text-sm">Allow Multiple Open</span>
                </label>
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
                placeholder="FAQ subtitle"
                rows={2}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>Categories</Label>
              <Button onClick={handleCategoryAdd} size="sm" variant="outline">
                <IconPlus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
              {editConfig.categories?.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={category}
                    onChange={(e) =>
                      handleCategoryUpdate(index, e.target.value)
                    }
                    placeholder="Category name"
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleCategoryRemove(index)}
                    size="sm"
                    variant="destructive"
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label>FAQ Items</Label>
              <Button onClick={handleItemAdd} size="sm" variant="outline">
                <IconPlus className="h-4 w-4 mr-2" />
                Add FAQ
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {editConfig.items.map((item, index) => (
                <Card key={item.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        FAQ {index + 1}
                      </span>
                      <Button
                        onClick={() => handleItemRemove(index)}
                        size="sm"
                        variant="destructive"
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label>Question</Label>
                      <Input
                        value={item.question}
                        onChange={(e) =>
                          handleItemUpdate(index, "question", e.target.value)
                        }
                        placeholder="FAQ question"
                      />
                    </div>

                    <div>
                      <Label>Answer</Label>
                      <Textarea
                        value={item.answer}
                        onChange={(e) =>
                          handleItemUpdate(index, "answer", e.target.value)
                        }
                        placeholder="FAQ answer"
                        rows={3}
                      />
                    </div>

                    {editConfig.categories &&
                      editConfig.categories.length > 0 && (
                        <div>
                          <Label>Category</Label>
                          <select
                            value={item.category || ""}
                            onChange={(e) =>
                              handleItemUpdate(
                                index,
                                "category",
                                e.target.value
                              )
                            }
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="">No Category</option>
                            {editConfig.categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 px-4 ${normalizedConfig.className || ""}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        {(normalizedConfig.title || normalizedConfig.subtitle) && (
          <div className="text-center mb-12">
            {normalizedConfig.title && (
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {normalizedConfig.title}
              </h2>
            )}
            {normalizedConfig.subtitle && (
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                {normalizedConfig.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Search and Filter */}
        {(normalizedConfig.searchable || uniqueCategories.length > 1) && (
          <div className="mb-8 space-y-4">
            {normalizedConfig.searchable && (
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            )}

            {uniqueCategories.length > 1 && (
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category || "all")}
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FAQ Content */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm || selectedCategory !== "all"
                ? "No FAQs match your search criteria."
                : "No FAQs available."}
            </p>
          </div>
        ) : (
          <Accordion
            type={normalizedConfig.allowMultiple ? "multiple" : "single"}
            collapsible
            className="space-y-4"
          >
            {filteredItems.map((item, index) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border rounded-lg px-6 py-2 bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow"
              >
                <AccordionTrigger className="text-left hover:no-underline py-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {item.question}
                    </h3>
                    {item.category && (
                      <span className="text-xs text-muted-foreground mt-1 inline-block">
                        {item.category}
                      </span>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div
                    className="text-gray-600 dark:text-gray-300 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: item.answer.replace(/\n/g, "<br>"),
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}

        {/* Edit Button */}
        {editable && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <IconEdit className="h-4 w-4 mr-2" />
              Edit FAQ
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
