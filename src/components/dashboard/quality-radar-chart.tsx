import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { Target } from "lucide-react";

const COLORS = {
  good: "#3b82f6",
};

interface QualityRadarChartProps {
  qualityMetrics: any;
}

export function QualityRadarChart({ qualityMetrics }: QualityRadarChartProps) {
  const radarData = [
    {
      subject: "Academic Excellence",
      A: qualityMetrics.academic,
      fullMark: 100,
    },
    { subject: "Teaching Quality", A: qualityMetrics.teaching, fullMark: 100 },
    {
      subject: "Student Satisfaction",
      A: qualityMetrics.satisfaction,
      fullMark: 100,
    },
    {
      subject: "Resource Utilization",
      A: qualityMetrics.operational,
      fullMark: 100,
    },
    { subject: "Innovation", A: 75, fullMark: 100 },
    { subject: "Infrastructure", A: 82, fullMark: 100 },
  ];

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="h-5 w-5 mr-2 text-blue-600" />
          Quality Assessment Radar
        </CardTitle>
        <CardDescription>
          Multi-dimensional quality evaluation across key areas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            A: { label: "Score", color: COLORS.good },
          }}
          className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 10 }}
              />
              <Radar
                name="Quality Score"
                dataKey="A"
                stroke={COLORS.good}
                fill={COLORS.good}
                fillOpacity={0.3}
                strokeWidth={2}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
