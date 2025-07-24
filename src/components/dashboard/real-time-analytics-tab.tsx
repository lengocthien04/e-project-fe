// src/components/dashboard/real-time-analytics-tab.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  Activity,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  RefreshCw,
  Zap,
} from "lucide-react";

interface RealTimeMetrics {
  activeStudents: number;
  onlineTeachers: number;
  liveClasses: number;
  systemLoad: number;
  avgResponseTime: number;
  errorRate: number;
}

interface LiveActivity {
  timestamp: string;
  students: number;
  teachers: number;
  classes: number;
}

export function RealTimeAnalyticsTab() {
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    activeStudents: 0,
    onlineTeachers: 0,
    liveClasses: 0,
    systemLoad: 0,
    avgResponseTime: 0,
    errorRate: 0,
  });

  const [liveData, setLiveData] = useState<LiveActivity[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Generate mock real-time data
  const generateMockMetrics = (): RealTimeMetrics => ({
    activeStudents: 44,
    onlineTeachers: 13,
    liveClasses: Math.floor(Math.random() * 15) + 25,
    systemLoad: Math.floor(Math.random() * 30) + 40,
    avgResponseTime: Math.floor(Math.random() * 50) + 150,
    errorRate: Math.random() * 2,
  });

  const generateLiveActivity = (): LiveActivity[] => {
    const now = new Date();
    const data: LiveActivity[] = [];

    for (let i = 29; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60000); // 30 minutes of data
      data.push({
        timestamp: time.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }),
        students: 44,
        teachers: 13,
        classes: Math.floor(Math.random() * 20) + 20,
      });
    }

    return data;
  };

  // Refresh data
  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      // In a real app, you would fetch from your analytics API
      // For now, we'll use mock data
      setMetrics(generateMockMetrics());
      setLiveData(generateLiveActivity());
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSystemHealthColor = (load: number) => {
    if (load < 50) return "text-green-600";
    if (load < 75) return "text-yellow-600";
    return "text-red-600";
  };

  const getSystemHealthBadge = (load: number) => {
    if (load < 50) return "default";
    if (load < 75) return "secondary";
    return "destructive";
  };

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Real-time Analytics
          </h2>
          <p className="text-gray-600">
            Live system metrics and activity monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
          <Button
            onClick={refreshData}
            disabled={isRefreshing}
            variant="outline"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">
                  Active Students
                </p>
                <p className="text-3xl font-bold text-blue-900">
                  {metrics.activeStudents}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-blue-600">Online now</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">
                  Online Teachers
                </p>
                <p className="text-3xl font-bold text-green-900">
                  {metrics.onlineTeachers}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-green-600">Teaching now</span>
                </div>
              </div>
              <GraduationCap className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">
                  Live Classes
                </p>
                <p className="text-3xl font-bold text-purple-900">
                  {metrics.liveClasses}
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-purple-600">In session</span>
                </div>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700">
                  System Load
                </p>
                <p
                  className={`text-3xl font-bold ${getSystemHealthColor(
                    metrics.systemLoad
                  )}`}
                >
                  {metrics.systemLoad}%
                </p>
                <Badge
                  variant={getSystemHealthBadge(metrics.systemLoad)}
                  className="mt-2"
                >
                  {metrics.systemLoad < 50
                    ? "Healthy"
                    : metrics.systemLoad < 75
                    ? "Moderate"
                    : "High"}
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live User Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Live User Activity
            </CardTitle>
            <CardDescription>
              Real-time user engagement over the last 30 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                students: { label: "Students", color: "#3b82f6" },
                teachers: { label: "Teachers", color: "#10b981" },
              }}
              className="h-[300px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={liveData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="timestamp"
                    fontSize={12}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="students"
                    stackId="1"
                    stroke="var(--color-students)"
                    fill="var(--color-students)"
                    fillOpacity={0.6}
                  />
                  <Area
                    type="monotone"
                    dataKey="teachers"
                    stackId="1"
                    stroke="var(--color-teachers)"
                    fill="var(--color-teachers)"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* System Performance */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              System Performance
            </CardTitle>
            <CardDescription>
              Real-time system health and response metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">System Load</span>
                  <span className="text-sm text-gray-600">
                    {metrics.systemLoad}%
                  </span>
                </div>
                <Progress value={metrics.systemLoad} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Response Time</span>
                  <span className="text-sm text-gray-600">
                    {metrics.avgResponseTime}ms
                  </span>
                </div>
                <Progress
                  value={Math.min(metrics.avgResponseTime / 5, 100)}
                  className="h-2"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Error Rate</span>
                  <span className="text-sm text-gray-600">
                    {metrics.errorRate.toFixed(2)}%
                  </span>
                </div>
                <Progress value={metrics.errorRate * 10} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600">Uptime</p>
                  <p className="text-lg font-bold text-green-800">99.8%</p>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-600">Requests/min</p>
                  <p className="text-lg font-bold text-blue-800">5</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Class Activity */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-purple-600" />
            Live Class Activity
          </CardTitle>
          <CardDescription>
            Active classes and engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              classes: { label: "Active Classes", color: "#8b5cf6" },
            }}
            className="h-[250px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={liveData.slice(-15)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="timestamp"
                  fontSize={12}
                  tick={{ fontSize: 10 }}
                />
                <YAxis fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="classes"
                  fill="var(--color-classes)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Alert System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-green-500 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  System Status
                </p>
                <p className="text-xs text-green-600">
                  All systems operational
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-blue-800">Peak Usage</p>
                <p className="text-xs text-blue-600">High activity detected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Resource Usage
                </p>
                <p className="text-xs text-yellow-600">Moderate load levels</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
