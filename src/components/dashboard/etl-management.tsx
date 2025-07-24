// src/components/dashboard/etl-management.tsx
import { useState, useEffect, useContext } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Play,
  RefreshCw,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  AlertCircle,
} from "lucide-react";
import { ETLJobResult, ETLStatus } from "@/types/analytics.type";
import { toast } from "sonner";
import { analyticsApi, etlApi } from "@/apis/analytics.api";
import { AppContext } from "@/contexts/app.context";

export function ETLManagement() {
  const [etlStatus, setETLStatus] = useState<ETLStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastJobResult, setLastJobResult] = useState<ETLJobResult | null>(null);
  const { profile } = useContext(AppContext);
  // Load ETL status
  const loadETLStatus = async () => {
    try {
      const response = await etlApi.getETLStatus();
      setETLStatus(response.data || null);
    } catch (error) {
      console.error("Failed to load ETL status:", error);
      toast.error("Failed to load ETL status");
    }
  };

  // Run full ETL
  const runFullETL = async () => {
    try {
      setLoading(true);
      toast.info("Starting full ETL process...");

      const response = await analyticsApi.runFullETL();
      setLastJobResult(response.data || null);

      if (response?.data?.success) {
        toast.success("Full ETL completed successfully");
      } else {
        toast.error("ETL completed with errors");
      }

      await loadETLStatus();
    } catch (error) {
      console.error("Failed to run full ETL:", error);
      toast.error("Failed to start ETL process");
    } finally {
      setLoading(false);
    }
  };

  // Run incremental ETL
  const runIncrementalETL = async () => {
    try {
      setLoading(true);
      toast.info("Starting incremental ETL process...");

      const lastRunDate =
        etlStatus?.lastRun ||
        new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const response = await analyticsApi.runIncrementalETL(lastRunDate);
      setLastJobResult(response?.data || null);

      if (response?.data?.success) {
        toast.success("Incremental ETL completed successfully");
      } else {
        toast.error("ETL completed with errors");
      }

      await loadETLStatus();
    } catch (error) {
      console.error("Failed to run incremental ETL:", error);
      toast.error("Failed to start incremental ETL process");
    } finally {
      setLoading(false);
    }
  };

  // Run specific analytics ETL
  const runSpecificETL = async (
    type: "student" | "teacher" | "course" | "department"
  ) => {
    try {
      setLoading(true);
      toast.info(`Starting ${type} analytics ETL...`);

      let response;
      switch (type) {
        case "student":
          response = await analyticsApi.runStudentAnalyticsETL();
          break;
        case "teacher":
          response = await analyticsApi.runTeacherAnalyticsETL();
          break;
        case "course":
          response = await analyticsApi.runCourseAnalyticsETL();
          break;
        case "department":
          response = await analyticsApi.runDepartmentAnalyticsETL();
          break;
      }

      if (response?.data.success) {
        toast.success(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } analytics ETL completed successfully`
        );
      } else {
        toast.error(
          `${
            type.charAt(0).toUpperCase() + type.slice(1)
          } analytics ETL completed with errors`
        );
      }

      await loadETLStatus();
    } catch (error) {
      console.error(`Failed to run ${type} ETL:`, error);
      toast.error(`Failed to start ${type} analytics ETL`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadETLStatus();

    // Refresh status every 30 seconds
    const interval = setInterval(loadETLStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatLastRun = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* ETL Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ETL Status</p>
                <div className="flex items-center mt-2">
                  {etlStatus?.isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 text-blue-500 animate-spin mr-2" />
                      <Badge variant="default">Running</Badge>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      <Badge variant="secondary">Idle</Badge>
                    </>
                  )}
                </div>
              </div>
              <Database className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last Run</p>
                <p className="text-sm text-gray-800 mt-1">
                  {formatLastRun(etlStatus?.lastRun || null)}
                </p>
              </div>
              <Clock className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  System Health
                </p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-600">
                    {etlStatus?.systemHealth || "Unknown"}
                  </span>
                </div>
              </div>
              <Settings className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-sm text-gray-800 mt-1">
                  {formatUptime(etlStatus?.uptime || 0)}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ETL Controls */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="h-5 w-5 mr-2 text-blue-600" />
            ETL Operations
          </CardTitle>
          <CardDescription>
            Manage data extraction, transformation, and loading processes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main ETL Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Full Data Refresh</h3>
              <p className="text-sm text-gray-600">
                Complete data extraction and analytics generation for all
                entities
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="default"
                    disabled={
                      loading ||
                      etlStatus?.isRunning ||
                      profile?.role !== "admin"
                    }
                    className="w-full"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Run Full ETL
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Run Full ETL Process</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will process all data and may take several minutes to
                      complete. Are you sure you want to proceed?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={runFullETL}
                      disabled={profile?.role !== "admin"}
                    >
                      Start Full ETL
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Incremental Update</h3>
              <p className="text-sm text-gray-600">
                Process only recently changed data for faster updates
              </p>
              <Button
                variant="outline"
                disabled={
                  loading || etlStatus?.isRunning || profile?.role !== "admin"
                }
                onClick={runIncrementalETL}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Run Incremental ETL
              </Button>
            </div>
          </div>

          <Separator />

          {/* Specific Analytics ETL */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Targeted Analytics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                disabled={
                  loading || etlStatus?.isRunning || profile?.role !== "admin"
                }
                onClick={() => runSpecificETL("student")}
                className="h-20 flex-col"
              >
                <Database className="h-5 w-5 mb-1" />
                Student Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  loading || etlStatus?.isRunning || profile?.role !== "admin"
                }
                onClick={() => runSpecificETL("teacher")}
                className="h-20 flex-col"
              >
                <Database className="h-5 w-5 mb-1" />
                Teacher Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  loading || etlStatus?.isRunning || profile?.role !== "admin"
                }
                onClick={() => runSpecificETL("course")}
                className="h-20 flex-col"
              >
                <Database className="h-5 w-5 mb-1" />
                Course Analytics
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={
                  loading || etlStatus?.isRunning || profile?.role !== "admin"
                }
                onClick={() => runSpecificETL("department")}
                className="h-20 flex-col"
              >
                <Database className="h-5 w-5 mb-1" />
                Department Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Last Job Result */}
      {lastJobResult && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              {lastJobResult.success ? (
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 mr-2 text-red-600" />
              )}
              Last Job Result
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Job ID</p>
                <p className="text-sm text-gray-800">{lastJobResult.jobId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Records Processed
                </p>
                <p className="text-sm text-gray-800">
                  {lastJobResult.recordsProcessed}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Records Created
                </p>
                <p className="text-sm text-gray-800">
                  {lastJobResult.recordsCreated}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Execution Time
                </p>
                <p className="text-sm text-gray-800">
                  {lastJobResult.executionTime}ms
                </p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600 mb-2">Message</p>
              <p className="text-sm text-gray-800">{lastJobResult.message}</p>
            </div>

            {lastJobResult.errors.length > 0 && (
              <div>
                <p className="text-sm font-medium text-red-600 mb-2">Errors</p>
                <div className="bg-red-50 p-3 rounded-lg max-h-32 overflow-y-auto">
                  {lastJobResult.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-800">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
