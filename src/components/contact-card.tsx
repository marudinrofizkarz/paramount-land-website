"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
  action?: string;
  colorClass?: string;
  iconBgClass?: string;
}

export function ContactCard({
  icon: Icon,
  title,
  details,
  action,
  colorClass = "from-indigo-500 to-purple-500",
  iconBgClass = "bg-white/10",
}: ContactCardProps) {
  const handleClick = () => {
    if (action) {
      if (action.startsWith("http")) {
        window.open(action, "_blank");
      } else {
        window.location.href = action;
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="h-full"
    >
      <Card
        onClick={action ? handleClick : undefined}
        className={cn(
          "overflow-hidden h-full border-none shadow-lg cursor-pointer relative bg-gradient-to-br",
          colorClass
        )}
      >
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

        {/* Card content */}
        <div className="relative p-6 flex flex-col h-full text-white z-10">
          {/* Icon */}
          <div className={cn("p-3 rounded-xl mb-6 self-start", iconBgClass)}>
            <Icon size={28} strokeWidth={1.5} />
          </div>

          {/* Title */}
          <h3 className="font-bold text-xl mb-4">{title}</h3>

          {/* Details */}
          <div className="space-y-2 flex-grow">
            {details.map((detail, idx) => (
              <p
                key={idx}
                className="text-white/90 leading-relaxed font-light text-base"
              >
                {detail}
              </p>
            ))}
          </div>

          {/* Hint icon for clickable cards */}
          {action && (
            <div className="mt-4 self-end">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

export function SocialLinkCard({
  children,
  href,
  colorClass = "from-blue-500 to-indigo-500",
}: {
  children: ReactNode;
  href: string;
  colorClass?: string;
}) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "flex items-center justify-center p-4 rounded-xl bg-gradient-to-br text-white",
        colorClass
      )}
    >
      {children}
    </motion.a>
  );
}
