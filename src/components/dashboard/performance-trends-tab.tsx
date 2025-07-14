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
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  PieChartIcon,
  Zap,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const COLORS = {
  good: "#3b82f6",
  excellent: "#10b981",
  accent: "#8b5cf6",
  teal: "#14b8a6",
  average: "#f59e0b",
  poor: "#ef4444",
  critical: "#dc2626",
};

interface PerformanceTrendsTabProps {
  performanceTrends: any[];
  departmentQuality: any[];
  qualityMetrics: any;
}

export function PerformanceTrendsTab({
  performanceTrends,
  departmentQuality,
  qualityMetrics,
}: PerformanceTrendsTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quality Trends Over Time */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Quality Trends Over Time
            </CardTitle>
            <CardDescription>
              Historical quality performance tracking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                qualityScore: { label: "Overall Quality", color: COLORS.good },
                academicPerformance: {
                  label: "Academic",
                  color: COLORS.excellent,
                },
                teachingQuality: { label: "Teaching", color: COLORS.accent },
                studentSatisfaction: {
                  label: "Satisfaction",
                  color: COLORS.teal,
                },
              }}
              className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceTrends}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="qualityScore"
                    stroke="var(--color-qualityScore)"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="academicPerformance"
                    stroke="var(--color-academicPerformance)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="teachingQuality"
                    stroke="var(--color-teachingQuality)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                  <Line
                    type="monotone"
                    dataKey="studentSatisfaction"
                    stroke="var(--color-studentSatisfaction)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2 text-green-600" />
              Quality Grade Distribution
            </CardTitle>
            <CardDescription>
              Distribution of quality grades across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Departments", color: COLORS.good },
              }}
              className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      {
                        grade: "A",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "A"
                        ).length,
                        color: COLORS.excellent,
                      },
                      {
                        grade: "B",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "B"
                        ).length,
                        color: COLORS.good,
                      },
                      {
                        grade: "C",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "C"
                        ).length,
                        color: COLORS.average,
                      },
                      {
                        grade: "D",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "D"
                        ).length,
                        color: COLORS.poor,
                      },
                      {
                        grade: "F",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "F"
                        ).length,
                        color: COLORS.critical,
                      },
                    ].filter((item) => item.count > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    dataKey="count"
                    label={({ grade, count, percent }) =>
                      `${grade}: ${count} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {[
                      {
                        grade: "A",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "A"
                        ).length,
                        color: COLORS.excellent,
                      },
                      {
                        grade: "B",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "B"
                        ).length,
                        color: COLORS.good,
                      },
                      {
                        grade: "C",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "C"
                        ).length,
                        color: COLORS.average,
                      },
                      {
                        grade: "D",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "D"
                        ).length,
                        color: COLORS.poor,
                      },
                      {
                        grade: "F",
                        count: departmentQuality.filter(
                          (d) => d.qualityGrade === "F"
                        ).length,
                        color: COLORS.critical,
                      },
                    ]
                      .filter((item) => item.count > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-3 border rounded-lg shadow-lg">
                            <p className="font-medium">Grade {data.grade}</p>
                            <p className="text-sm text-gray-600">
                              {data.count} departments
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="h-5 w-5 mr-2 text-purple-600" />
            Predictive Quality Indicators
          </CardTitle>
          <CardDescription>AI-powered insights and forecasting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Quality Forecast
              </h3>
              <p className="text-3xl font-bold text-blue-700 mb-1">+3.2%</p>
              <p className="text-sm text-blue-600">
                Expected improvement next quarter
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Success Probability
              </h3>
              <p className="text-3xl font-bold text-green-700 mb-1">87%</p>
              <p className="text-sm text-green-600">
                Likelihood of meeting quality targets
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <AlertCircle className="h-12 w-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                Risk Assessment
              </h3>
              <p className="text-3xl font-bold text-purple-700 mb-1">Low</p>
              <p className="text-sm text-purple-600">
                Overall institutional risk level
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
