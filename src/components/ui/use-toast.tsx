"use client";

import * as React from "react";
import { createContext, useContext, useState } from "react";
import { Toaster } from "./toaster";

type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  duration?: number;
};

type ToastContextType = {
  toast: (props: ToastProps) => void;
  dismissToast: (id: string) => void;
  toasts: Array<ToastProps & { id: string }>;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Array<ToastProps & { id: string }>>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...props, id }]);

    // Auto dismiss after duration (default: 5000ms)
    setTimeout(() => {
      dismissToast(id);
    }, props.duration || 5000);

    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, dismissToast, toasts }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function toast(props: ToastProps) {
  const { toast } = useToast();
  return toast(props);
}
