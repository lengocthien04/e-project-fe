"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ETLManagement } from "./etl-management";
import { RealTimeAnalyticsTab } from "./real-time-analytics-tab";
import { useIntegratedAnalytics } from "@/hooks/use-integrated-analytics";
import {
  Activity,
  Database,
  Download,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function EducationAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("analytics-overview");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");

  const {
    students,
    teachers,
    courses,
    departments,
    qualityMetrics,
    departmentQuality,
    riskAssessment,
    performanceTrends,
    loading,
    error,
    loadAllData,
  } = useIntegratedAnalytics();

  // Export functionality
  const handleExportReport = () => {
    try {
      const reportData = {
        timestamp: new Date().toISOString(),
        selectedDepartment,
        selectedTimeframe,
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalCourses: courses.length,
        totalDepartments: departments.length,
        qualityMetrics,
        departmentQuality,
        riskAssessment,
        performanceTrends,
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });

      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `education-analytics-${
        new Date().toISOString().split("T")[0]
      }.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      toast.success("Analytics report exported successfully");
    } catch (error) {
      toast.error("Failed to export report");
      console.error("Export error:", error);
    }
  };

  // Filter department data
  const filteredDepartmentData =
    selectedDepartment === "all"
      ? departmentQuality
      : departmentQuality.filter(
          (dept) => dept.department === selectedDepartment
        );

  // Show loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <Skeleton className="h-10 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>

          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Data
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button
                onClick={() => loadAllData()}
                className="bg-red-600 hover:bg-red-700"
              >
                Retry Loading
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Activity className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Education Analytics Dashboard
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto text-sm md:text-base">
            Real-time analytics and insights from {students.length} students,{" "}
            {teachers.length} teachers, and {courses.length} courses across{" "}
            {departments.length} departments
          </p>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="current">Current Period</option>
              <option value="semester">This Semester</option>
              <option value="year">Academic Year</option>
            </select>

            <Button
              onClick={handleExportReport}
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>

            <Button
              onClick={() => loadAllData()}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Settings className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Overall Quality Score */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center">
                  <div className="relative w-16 h-16">
                    <svg
                      className="w-16 h-16 transform -rotate-90"
                      viewBox="0 0 36 36"
                    >
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="2"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="2"
                        strokeDasharray={`${qualityMetrics.overall}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold text-blue-900">
                        {qualityMetrics.overall}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-700">
                    Overall Quality
                  </p>
                  <Badge variant="secondary" className="mt-1">
                    {qualityMetrics.overall >= 85
                      ? "Excellent"
                      : qualityMetrics.overall >= 75
                      ? "Good"
                      : "Needs Improvement"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Students */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-green-700">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {students.length}
                  </p>
                  <div className="flex items-center text-sm text-green-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Avg GPA: {qualityMetrics.avgGPA}</span>
                  </div>
                </div>
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Teachers */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700">
                    Total Teachers
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {teachers.length}
                  </p>
                  <div className="flex items-center text-sm text-purple-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>Avg Rating: {qualityMetrics.avgTeacherRating}</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          {/* Total Courses */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-700">
                    Total Courses
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {courses.length}
                  </p>
                  <div className="flex items-center text-sm text-orange-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    <span>{departments.length} Departments</span>
                  </div>
                </div>
                <BookOpen className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-teal-700">
                    System Health
                  </p>
                  <p className="text-2xl font-bold text-teal-900">98.5%</p>
                  <div className="flex items-center text-sm text-teal-600">
                    <Activity className="h-4 w-4 mr-1" />
                    <span>Operational</span>
                  </div>
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Performance Table */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              Department Performance Overview
              {selectedDepartment !== "all" && (
                <Badge variant="outline" className="ml-2">
                  Filtered: {selectedDepartment}
                </Badge>
              )}
            </CardTitle>
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
                    <th className="text-center p-3 font-semibold">Courses</th>
                    <th className="text-center p-3 font-semibold">Avg GPA</th>
                    <th className="text-center p-3 font-semibold">Retention</th>
                    <th className="text-center p-3 font-semibold">
                      Risk Level
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepartmentData.map((dept, index) => {
                    const deptCourses = courses.filter(
                      (c) => c.department === dept.department
                    );
                    const deptTeachers = teachers.filter(
                      (t) => t.department === dept.department
                    );

                    return (
                      <tr
                        key={dept.department}
                        className={`border-b hover:bg-gray-50 ${
                          index % 2 === 0 ? "bg-gray-25" : ""
                        }`}
                      >
                        <td className="p-3 font-medium">{dept.department}</td>
                        <td className="text-center p-3">
                          <span className="font-bold text-blue-600">
                            {dept.qualityScore}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <Badge
                            variant={
                              dept.qualityGrade === "A"
                                ? "default"
                                : dept.qualityGrade === "B"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {dept.qualityGrade}
                          </Badge>
                        </td>
                        <td className="text-center p-3">{dept.studentCount}</td>
                        <td className="text-center p-3">
                          <span className="font-medium">
                            {deptTeachers.length}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <span className="font-medium">
                            {deptCourses.length}
                          </span>
                        </td>
                        <td className="text-center p-3">
                          <Badge
                            className={`${
                              dept.avgGPA >= 3.5
                                ? "bg-green-100 text-green-800"
                                : dept.avgGPA >= 3.0
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Risk Assessment Alert */}
        {riskAssessment.length > 0 && (
          <Card className="border-l-4 border-l-red-500 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <Activity className="h-6 w-6 text-red-600 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-900 mb-2">
                    Quality Risks Identified
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {riskAssessment.map((risk, index) => (
                      <div
                        key={index}
                        className="bg-white p-4 rounded-lg border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              risk.level === "High"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {risk.level} Risk
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {risk.type}
                          </span>
                        </div>
                        <p className="text-sm font-medium mb-1">
                          {risk.description}
                        </p>
                        <p className="text-xs text-gray-600 mb-2">
                          {risk.recommendation}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {risk.departments.slice(0, 2).map((dept, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs"
                            >
                              {dept.split(" ")[0]}
                            </Badge>
                          ))}
                          {risk.departments.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{risk.departments.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    High Performing Departments
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {
                      departmentQuality.filter((d) => d.qualityGrade === "A")
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-500">Grade A departments</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    At Risk Departments
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {
                      departmentQuality.filter((d) => d.riskLevel === "High")
                        .length
                    }
                  </p>
                  <p className="text-xs text-gray-500">
                    Need immediate attention
                  </p>
                </div>
                <Activity className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Students
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {students.filter((s) => s.status === "ACTIVE").length}
                  </p>
                  <p className="text-xs text-gray-500">Currently enrolled</p>
                </div>
                <GraduationCap className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Teachers
                  </p>
                  <p className="text-2xl font-bold text-purple-600">
                    {teachers.filter((t) => t.status === "ACTIVE").length}
                  </p>
                  <p className="text-xs text-gray-500">Currently teaching</p>
                </div>
                <Users className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 h-12 bg-blue-100 rounded-xl p-1 gap-2 shadow-sm">
            <TabsTrigger
              value="analytics-overview"
              className="flex items-center space-x-2 rounded-lg"
            >
              <Activity className="h-4 w-4" />
              <span>Real-time Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="etl-management"
              className="flex items-center space-x-2 rounded-lg"
            >
              <Database className="h-4 w-4" />
              <span>ETL Management</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics-overview">
            <RealTimeAnalyticsTab />
          </TabsContent>

          <TabsContent value="etl-management">
            <ETLManagement />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-8 border-t border-gray-200">
          <p>
            Education Analytics Dashboard • Last updated:{" "}
            {new Date().toLocaleString()} • Data from {students.length}{" "}
            students, {teachers.length} teachers, {courses.length} courses
          </p>
        </div>
      </div>
    </div>
  );
}
