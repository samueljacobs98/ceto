"use client";

import { ComponentProps } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { useTheme } from "@/lib/state/hooks";

import { Button } from "./button";

export function ToggleTheme({
  size = "icon",
  ...props
}: ComponentProps<typeof Button>) {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <Button
      {...props}
      size={size}
      variant="outline"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
