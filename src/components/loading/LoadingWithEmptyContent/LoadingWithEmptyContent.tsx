import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useViewport } from "../../../hooks/useViewport";

interface LoadingWithEmptyContentProps {
  size?: number;
  colors?: string[];
  message?: string;
  className?: string;
}

function ColorRing({
  size = 80,
  colors = ["#e6787a", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"],
}: {
  size?: number;
  colors?: string[];
}) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {colors.map((color, index) => (
        <div
          key={index}
          className="absolute rounded-full animate-spin"
          style={{
            width: `${size - index * 10}px`,
            height: `${size - index * 10}px`,
            border: `3px solid transparent`,
            borderTopColor: color,
            top: `${index * 5}px`,
            left: `${index * 5}px`,
            animationDelay: `${index * 0.1}s`,
            animationDuration: `${1 + index * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function LoadingWithEmptyContent({
  size = 80,
  colors = ["#e6787a", "#e6787a", "#e6787a", "#e6787a", "#e6787a"],
  message,
  className,
}: LoadingWithEmptyContentProps) {
  const viewport = useViewport();
  const height = viewport.height;

  return (
    <div className={cn("w-full", className)} style={{ height: height }}>
      <Fragment>
        {/* Backdrop overlay with shadcn/ui styling */}
        <motion.div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0.0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Loading content with shadcn/ui card styling */}
        <motion.div
          className="fixed left-1/2 top-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-4 rounded-lg border bg-background p-6 shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 100 }}
        >
          <ColorRing size={size} colors={colors} />
          {message && (
            <p className="text-sm text-muted-foreground text-center">
              {message}
            </p>
          )}
        </motion.div>
      </Fragment>
    </div>
  );
}
