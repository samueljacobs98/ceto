"use client";

import { useMemo } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { CopyIcon } from "lucide-react";

import { useCopyToClipboard } from "@/lib/state/hooks";

import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export function CopyUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const copy = useCopyToClipboard()[1];

  const url = useMemo(() => {
    if (typeof window === "undefined") return "";

    const baseUrl = window.location.origin;
    const params = searchParams.toString();

    return params.length === 0
      ? `${baseUrl}${pathname}`
      : `${baseUrl}${pathname}?${params}`;
  }, [pathname, searchParams]);

  const handleClick = () => {
    copy(url);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            className="rounded-full size-8"
            size="icon"
            onClick={handleClick}
          >
            <CopyIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">Copy URL</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
