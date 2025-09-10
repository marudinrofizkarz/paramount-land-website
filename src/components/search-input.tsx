"use client";
import { IconSearch } from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

export default function SearchInput() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  if (isSearchOpen) {
    return (
      <div className="w-full space-y-2">
        <Input
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search..."
          className="h-9 w-full md:w-40 lg:w-64"
          onBlur={() => {
            if (!searchValue) {
              setIsSearchOpen(false);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setIsSearchOpen(false);
              setSearchValue("");
            }
          }}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-2">
      <Button
        variant="outline"
        className="bg-background text-muted-foreground relative h-9 w-full justify-start rounded-[0.5rem] text-sm font-normal shadow-none sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setIsSearchOpen(true)}
      >
        <IconSearch className="mr-2 h-4 w-4" />
        Search...
      </Button>
    </div>
  );
}
