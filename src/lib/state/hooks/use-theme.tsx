import { useEffect, useState } from "react";
import { useTheme as _useTheme } from "next-themes";

export function useTheme() {
  const { resolvedTheme, setTheme } = _useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { theme: resolvedTheme, setTheme, mounted };
}
