"use client";

import { useState } from "react";
import { useStudents } from "@/contexts/student-context";
import { useTeachers } from "@/contexts/teacher-context";
import { useCurricula } from "@/contexts/curriculum-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { QualityMetricsOverview } from "@/components/dashboard/quality-metrics-overview";

import { useQualityMetrics } from "@/hooks/use-quality-metrics";
import { Eye, BarChart3, TrendingUp, Brain } from "lucide-react";
import { RiskAssessmentAlert } from "./risk-assessment-alert";
import { QualityOverviewTab } from "./quality-overview-tab";
import { DepartmentAnalysisTab } from "./department-analysis-tab";
import { PerformanceTrendsTab } from "./performance-trends-tab";
import { RecommendationsTab } from "./recommendations-tab";

export function EducationQualityDashboard() {
  const { students } = useStudents();
  const { teachers } = useTeachers();
  const { curricula } = useCurricula();

  const [activeTab, setActiveTab] = useState("quality-overview");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");

  const {
    qualityMetrics,
    departmentQuality,
    riskAssessment,
    performanceTrends,
  } = useQualityMetrics(students, teachers, curricula);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <DashboardHeader
          selectedDepartment={selectedDepartment}
          setSelectedDepartment={setSelectedDepartment}
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          departmentQuality={departmentQuality}
        />

        <QualityMetricsOverview qualityMetrics={qualityMetrics} />

        <RiskAssessmentAlert riskAssessment={riskAssessment} />

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-12 bg-blue-100 rounded-xl p-1 gap-2 shadow-sm">
            <TabsTrigger
              value="quality-overview"
              className="flex items-center space-x-2 rounded-lg"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Quality Overview</span>
              <span className="sm:hidden">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="department-analysis"
              className="flex items-center space-x-2 rounded-lg"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Department Analysis</span>
              <span className="sm:hidden">Departments</span>
            </TabsTrigger>
            <TabsTrigger
              value="performance-trends"
              className="flex items-center space-x-2 rounded-lg"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Performance Trends</span>
              <span className="sm:hidden">Trends</span>
            </TabsTrigger>
            <TabsTrigger
              value="recommendations"
              className="flex items-center space-x-2 rounded-lg"
            >
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendations</span>
              <span className="sm:hidden">Actions</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quality-overview">
            <QualityOverviewTab
              qualityMetrics={qualityMetrics}
              departmentQuality={departmentQuality}
            />
          </TabsContent>

          <TabsContent value="department-analysis">
            <DepartmentAnalysisTab departmentQuality={departmentQuality} />
          </TabsContent>

          <TabsContent value="performance-trends">
            <PerformanceTrendsTab
              performanceTrends={performanceTrends}
              departmentQuality={departmentQuality}
              qualityMetrics={qualityMetrics}
            />
          </TabsContent>

          <TabsContent value="recommendations">
            <RecommendationsTab
              riskAssessment={riskAssessment}
              departmentQuality={departmentQuality}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
