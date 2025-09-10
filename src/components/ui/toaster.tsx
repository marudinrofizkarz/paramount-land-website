"use client";

import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Create a client-only version of the Toaster component
const DynamicToaster = dynamic(
  () =>
    Promise.resolve(() => {
      const { toasts } = useToast();

      return (
        <ToastProvider>
          {toasts.map(function ({ id, title, description, action, ...props }) {
            return (
              <Toast key={id} {...props}>
                <div className="grid gap-1">
                  {title && <ToastTitle>{title}</ToastTitle>}
                  {description && (
                    <ToastDescription>{description}</ToastDescription>
                  )}
                </div>
                {action}
                <ToastClose />
              </Toast>
            );
          })}
          <ToastViewport />
        </ToastProvider>
      );
    }),
  { ssr: false }
);

// Export a simplified toaster that handles SSR properly
export function Toaster() {
  return <DynamicToaster />;
}
