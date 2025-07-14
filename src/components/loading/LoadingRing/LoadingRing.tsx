import { cn } from "@/lib/utils";

interface Props {
  width?: number;
  colorCode?: string;
  className?: string;
}

export default function LoadingRing({
  width = 80,
  colorCode = "#294BCC",
  className,
}: Props) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div
        className="animate-spin rounded-full border-4 border-gray-200 border-t-current"
        style={{
          width: `${width}px`,
          height: `${width}px`,
          borderTopColor: colorCode,
        }}
      />
    </div>
  );
}
