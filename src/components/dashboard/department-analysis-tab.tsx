import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
} from "recharts";
import { BarChart3, Activity, Users } from "lucide-react";

const COLORS = {
  good: "#3b82f6",
  accent: "#8b5cf6",
};

interface DepartmentAnalysisTabProps {
  departmentQuality: any[];
}

export function DepartmentAnalysisTab({
  departmentQuality,
}: DepartmentAnalysisTabProps) {
  const getQualityColor = (score: number) => {
    if (score >= 85) return "#10b981";
    if (score >= 75) return "#3b82f6";
    if (score >= 65) return "#f59e0b";
    return "#ef4444";
  };

  const getQualityBadgeVariant = (score: number) => {
    if (score >= 85) return "default";
    if (score >= 75) return "secondary";
    if (score >= 65) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Performance Chart */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Department Performance Comparison
            </CardTitle>
            <CardDescription>Quality scores across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                qualityScore: { label: "Quality Score", color: COLORS.good },
              }}
              className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
            >
              <ResponsiveContainer height="100%" width="100%">
                <BarChart
                  data={departmentQuality}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="shortName"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.department}</p>
                            <p className="text-sm text-gray-600">
                              Quality Score: {data.qualityScore}
                            </p>
                            <p className="text-sm text-gray-600">
                              Grade: {data.qualityGrade}
                            </p>
                            <p className="text-sm text-gray-600">
                              Risk Level: {data.riskLevel}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="qualityScore"
                    fill={COLORS.good}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        {/* Academic vs Teaching Chart */}

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Department Metrics Comparison
            </CardTitle>
            <CardDescription>
              Key performance indicators across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                retentionRate: { label: "Retention Rate", color: "#10b981" },
                utilizationRate: {
                  label: "Utilization Rate",
                  color: "#3b82f6",
                },
              }}
              className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentQuality}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="shortName"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.department}</p>
                            <p className="text-sm text-gray-600">
                              Retention: {data.retentionRate}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Utilization: {data.utilizationRate}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Student-Teacher Ratio: {data.studentTeacherRatio}
                              :1
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey="retentionRate"
                    fill="#10b981"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="utilizationRate"
                    fill="#3b82f6"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-purple-600" />
              Department Efficiency Analysis
            </CardTitle>
            <CardDescription>
              Retention vs Utilization (bubble size = student count)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                retentionRate: {
                  label: "Retention Rate",
                  color: COLORS.accent,
                },
              }}
              className="h-[350px] xl:max-w-[548px] lg:max-w-[396px] md:max-w-[624px] max-w-[247px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  data={departmentQuality}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="utilizationRate"
                    name="Utilization Rate"
                    fontSize={12}
                    label={{
                      value: "Course Utilization (%)",
                      position: "insideBottom",
                      offset: -10,
                    }}
                  />
                  <YAxis
                    dataKey="retentionRate"
                    name="Retention Rate"
                    fontSize={12}
                    label={{
                      value: "Student Retention (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <ChartTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded-lg shadow-lg">
                            <p className="font-medium">{data.department}</p>
                            <p className="text-sm text-gray-600">
                              Retention: {data.retentionRate}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Utilization: {data.utilizationRate}%
                            </p>
                            <p className="text-sm text-gray-600">
                              Students: {data.studentCount}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter dataKey="retentionRate" fill={COLORS.accent} r={8} />
                </ScatterChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Department Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-green-600" />
            Detailed Department Analysis
          </CardTitle>
          <CardDescription>
            Comprehensive metrics for quality assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold">Department</th>
                  <th className="text-center p-3 font-semibold">
                    Quality Score
                  </th>
                  <th className="text-center p-3 font-semibold">Grade</th>
                  <th className="text-center p-3 font-semibold">Students</th>
                  <th className="text-center p-3 font-semibold">Teachers</th>
                  <th className="text-center p-3 font-semibold">Avg GPA</th>

                  <th className="text-center p-3 font-semibold">Retention</th>
                  <th className="text-center p-3 font-semibold">Risk Level</th>
                </tr>
              </thead>
              <tbody>
                {departmentQuality.map((dept, index) => (
                  <tr
                    key={dept.department}
                    className={`border-b hover:bg-gray-50 ${
                      index % 2 === 0 ? "bg-gray-25" : ""
                    }`}
                  >
                    <td className="p-3 font-medium">{dept.department}</td>
                    <td className="text-center p-3">
                      <span
                        className="font-bold"
                        style={{ color: getQualityColor(dept.qualityScore) }}
                      >
                        {dept.qualityScore}
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <Badge
                        variant={getQualityBadgeVariant(dept.qualityScore)}
                      >
                        {dept.qualityGrade}
                      </Badge>
                    </td>
                    <td className="text-center p-3">{dept.studentCount}</td>
                    <td className="text-center p-3">{dept.teacherCount}</td>
                    <td className="text-center p-3">
                      <Badge
                        className={`${
                          dept.avgGPA >= 3.5
                            ? "bg-green-100 text-green-800 border-green-200"
                            : dept.avgGPA >= 3.0
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {dept.avgGPA}
                      </Badge>
                    </td>

                    <td className="text-center p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          dept.retentionRate >= 90
                            ? "bg-green-100 text-green-800"
                            : dept.retentionRate >= 80
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {dept.retentionRate}%
                      </span>
                    </td>
                    <td className="text-center p-3">
                      <Badge
                        variant={
                          dept.riskLevel === "Low"
                            ? "default"
                            : dept.riskLevel === "Medium"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {dept.riskLevel}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
