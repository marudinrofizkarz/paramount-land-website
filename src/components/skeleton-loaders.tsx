"use client";

import React from "react";

export function ProjectCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-muted h-full flex flex-col animate-pulse">
      <div className="h-48 bg-muted"></div>
      <div className="p-4 space-y-3 flex-1">
        <div className="h-6 bg-muted rounded w-3/4"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-4 bg-muted rounded w-2/3"></div>
        <div className="mt-4 flex justify-between">
          <div className="h-8 w-24 bg-muted rounded"></div>
          <div className="h-8 w-8 bg-muted rounded-full"></div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsSectionSkeleton() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="h-10 w-48 bg-muted rounded-md mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function NewsSectionSkeleton() {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="h-10 w-48 bg-muted rounded-md mb-8 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-muted bg-background"
            >
              <div className="h-40 bg-muted animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 w-1/4 bg-muted rounded animate-pulse"></div>
                <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
