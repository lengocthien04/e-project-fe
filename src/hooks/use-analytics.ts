/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/use-analytics.ts
import { useState, useEffect } from "react";
import {
  QualityMetrics,
  DepartmentQuality,
  PerformanceTrend,
  RiskAssessment,
  AnalyticsType,
  AnalyticsPeriod,
} from "@/types/analytics.type";
import { analyticsApi } from "@/apis/analytics.api";

export function useAnalytics() {
  const [qualityMetrics, setQualityMetrics] = useState<QualityMetrics>({
    overall: 0,
    academic: 0,
    teaching: 0,
    operational: 0,
    satisfaction: 0,
    avgGPA: 0,
    avgTeacherRating: 0,
    retentionRate: 0,
    utilizationRate: 0,
  });
  const [departmentQuality, setDepartmentQuality] = useState<
    DepartmentQuality[]
  >([]);
  const [performanceTrends, setPerformanceTrends] = useState<
    PerformanceTrend[]
  >([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load analytics data
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get department analytics
      const departmentAnalytics = await analyticsApi.getComparativeAnalytics(
        AnalyticsType.DEPARTMENT_ANALYTICS,
        "department",
        AnalyticsPeriod.SEMESTER
      );
      const untransformData = departmentAnalytics?.data || [];
      // Transform department analytics to dashboard format
      const transformedDepartments: DepartmentQuality[] = untransformData
        .map((dept, index) => ({
          department: dept.department || `Department ${index + 1}`,
          shortName:
            dept.department?.substring(0, 3).toUpperCase() || `D${index + 1}`,
          qualityScore: Math.round(dept.averageGPA * 25), // Convert GPA to quality score
          qualityGrade: getQualityGrade(dept.averageGPA * 25),
          riskLevel: getRiskLevel(dept.passRate),
          studentCount: Math.floor(Math.random() * 500) + 100, // Mock data
          teacherCount: Math.floor(Math.random() * 30) + 10, // Mock data
          avgGPA: Number(dept.averageGPA.toFixed(2)),
          retentionRate: Number(dept.attendanceRate.toFixed(1)),
          utilizationRate: Number(dept.enrollmentRate.toFixed(1)),
          studentTeacherRatio: Math.floor(Math.random() * 20) + 15, // Mock data
        }))
        .sort((a, b) => b.qualityScore - a.qualityScore);

      setDepartmentQuality(transformedDepartments);

      // Calculate overall quality metrics
      const overallMetrics = calculateQualityMetrics(transformedDepartments);
      setQualityMetrics(overallMetrics);

      // Generate performance trends (mock data for now)
      const trends = generatePerformanceTrends();
      setPerformanceTrends(trends);

      // Generate risk assessment
      const risks = generateRiskAssessment(transformedDepartments);
      setRiskAssessment(risks);
    } catch (err) {
      console.error("Error loading analytics:", err);
      setError("Failed to load analytics data");

      // Fallback to mock data
      const mockData = generateMockData();
      setDepartmentQuality(mockData.departments);
      setQualityMetrics(mockData.metrics);
      setPerformanceTrends(mockData.trends);
      setRiskAssessment(mockData.risks);
    } finally {
      setLoading(false);
    }
  };

  // Load student performance analytics
  const loadStudentAnalytics = async (filters?: any) => {
    try {
      const response = await analyticsApi.getStudentPerformanceAnalytics(
        filters
      );
      return response.data;
    } catch (err) {
      console.error("Error loading student analytics:", err);
      return [];
    }
  };

  // Load teacher performance analytics
  const loadTeacherAnalytics = async (filters?: any) => {
    try {
      const response = await analyticsApi.getTeacherPerformanceAnalytics(
        filters
      );
      return response.data;
    } catch (err) {
      console.error("Error loading teacher analytics:", err);
      return [];
    }
  };

  // Load course analytics
  const loadCourseAnalytics = async (filters?: any) => {
    try {
      const response = await analyticsApi.getCourseAnalytics(filters);
      return response.data;
    } catch (err) {
      console.error("Error loading course analytics:", err);
      return [];
    }
  };

  // Helper functions
  const getQualityGrade = (score: number): string => {
    if (score >= 85) return "A";
    if (score >= 75) return "B";
    if (score >= 65) return "C";
    if (score >= 55) return "D";
    return "F";
  };

  const getRiskLevel = (passRate: number): string => {
    if (passRate >= 85) return "Low";
    if (passRate >= 70) return "Medium";
    return "High";
  };

  const calculateQualityMetrics = (
    departments: DepartmentQuality[]
  ): QualityMetrics => {
    const totalDepts = departments.length;
    if (totalDepts === 0) return qualityMetrics;

    const avgQualityScore =
      departments.reduce((sum, dept) => sum + dept.qualityScore, 0) /
      totalDepts;
    const avgGPA =
      departments.reduce((sum, dept) => sum + dept.avgGPA, 0) / totalDepts;
    const avgRetention =
      departments.reduce((sum, dept) => sum + dept.retentionRate, 0) /
      totalDepts;
    const avgUtilization =
      departments.reduce((sum, dept) => sum + dept.utilizationRate, 0) /
      totalDepts;

    return {
      overall: Math.round(avgQualityScore),
      academic: Math.round(avgGPA * 25), // Convert GPA to percentage
      teaching: Math.round((avgQualityScore + avgRetention) / 2),
      operational: Math.round(avgUtilization),
      satisfaction: Math.round(avgRetention),
      avgGPA: Number(avgGPA.toFixed(2)),
      avgTeacherRating: 4.2, // Mock data
      retentionRate: Number(avgRetention.toFixed(1)),
      utilizationRate: Number(avgUtilization.toFixed(1)),
    };
  };

  const generatePerformanceTrends = (): PerformanceTrend[] => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month) => ({
      month,
      qualityScore: Math.floor(Math.random() * 20) + 70,
      academicPerformance: Math.floor(Math.random() * 20) + 75,
      teachingQuality: Math.floor(Math.random() * 20) + 70,
      studentSatisfaction: Math.floor(Math.random() * 20) + 80,
      operationalEfficiency: Math.floor(Math.random() * 20) + 65,
    }));
  };

  const generateRiskAssessment = (
    departments: DepartmentQuality[]
  ): RiskAssessment[] => {
    const risks: RiskAssessment[] = [];

    const highRiskDepts = departments.filter((d) => d.riskLevel === "High");
    if (highRiskDepts.length > 0) {
      risks.push({
        type: "Academic Performance",
        level: "High",
        description:
          "Multiple departments showing declining academic performance",
        departments: highRiskDepts.map((d) => d.department),
        impact: "High impact on institution reputation and student outcomes",
        recommendation:
          "Implement immediate intervention programs and additional support",
      });
    }

    const lowGPADepts = departments.filter((d) => d.avgGPA < 3.0);
    if (lowGPADepts.length > 0) {
      risks.push({
        type: "Grade Performance",
        level: "Medium",
        description: "Departments with below-average GPA performance",
        departments: lowGPADepts.map((d) => d.department),
        impact: "Medium impact on student success rates",
        recommendation: "Review curriculum and teaching methodologies",
      });
    }

    return risks;
  };

  const generateMockData = () => {
    const departments: DepartmentQuality[] = [
      {
        department: "Computer Science",
        shortName: "CS",
        qualityScore: 88,
        qualityGrade: "A",
        riskLevel: "Low",
        studentCount: 450,
        teacherCount: 25,
        avgGPA: 3.6,
        retentionRate: 92.5,
        utilizationRate: 85.2,
        studentTeacherRatio: 18,
      },
      {
        department: "Business Administration",
        shortName: "BA",
        qualityScore: 82,
        qualityGrade: "B",
        riskLevel: "Low",
        studentCount: 380,
        teacherCount: 22,
        avgGPA: 3.4,
        retentionRate: 89.1,
        utilizationRate: 78.9,
        studentTeacherRatio: 17,
      },
      {
        department: "Engineering",
        shortName: "ENG",
        qualityScore: 85,
        qualityGrade: "A",
        riskLevel: "Low",
        studentCount: 520,
        teacherCount: 28,
        avgGPA: 3.5,
        retentionRate: 90.8,
        utilizationRate: 82.4,
        studentTeacherRatio: 19,
      },
    ];

    const metrics = calculateQualityMetrics(departments);
    const trends = generatePerformanceTrends();
    const risks = generateRiskAssessment(departments);

    return { departments, metrics, trends, risks };
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return {
    qualityMetrics,
    departmentQuality,
    performanceTrends,
    riskAssessment,
    loading,
    error,
    loadAnalytics,
    loadStudentAnalytics,
    loadTeacherAnalytics,
    loadCourseAnalytics,
  };
}
