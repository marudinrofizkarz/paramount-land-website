"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseDropdownMenuOptions {
  closeOnEscape?: boolean;
  closeOnClickOutside?: boolean;
  hoverDelay?: number;
}

export function useDropdownMenu(options: UseDropdownMenuOptions = {}) {
  const {
    closeOnEscape = true,
    closeOnClickOutside = true,
    hoverDelay = 150,
  } = options;

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    if (!closeOnClickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [activeDropdown, closeOnClickOutside]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [activeDropdown, closeOnEscape]);

  const openDropdown = useCallback(
    (menuId: string) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setActiveDropdown(menuId);
    },
    [hoverTimeout]
  );

  const closeDropdown = useCallback(() => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, hoverDelay);
    setHoverTimeout(timeout);
  }, [hoverDelay]);

  const toggleDropdown = useCallback(
    (menuId: string) => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        setHoverTimeout(null);
      }
      setActiveDropdown(activeDropdown === menuId ? null : menuId);
    },
    [activeDropdown, hoverTimeout]
  );

  const forceClose = useCallback(() => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setActiveDropdown(null);
  }, [hoverTimeout]);

  return {
    activeDropdown,
    dropdownRef,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    forceClose,
  };
}
