/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/analytics-api.ts
import { api } from "@/lib/api-client";
import { SuccessResponse } from "@/types/common";
import {
  Analytics,
  AnalyticsFilters,
  AnalyticsTrend,
  ComparativeAnalytics,
  ETLJobResult,
  ETLJobRequest,
  ETLStatus,
  AnalyticsType,
  AnalyticsPeriod,
} from "@/types/analytics.type";

const analyticsApi = {
  // Get all analytics with filters
  getAllAnalytics(filters?: AnalyticsFilters) {
    const queryParams = new URLSearchParams();
    if (filters?.analyticsType)
      queryParams.append("analyticsType", filters.analyticsType);
    if (filters?.period) queryParams.append("period", filters.period);
    if (filters?.department)
      queryParams.append("department", filters.department);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);
    if (filters?.studentId)
      queryParams.append("studentId", filters.studentId.toString());
    if (filters?.teacherId)
      queryParams.append("teacherId", filters.teacherId.toString());
    if (filters?.courseId)
      queryParams.append("courseId", filters.courseId.toString());

    const queryString = queryParams.toString();
    const url = queryString ? `analytics?${queryString}` : "analytics";

    return api.get<SuccessResponse<Analytics[]>>(url);
  },

  // Get analytics by ID
  getAnalyticsById(id: number) {
    return api.get<SuccessResponse<Analytics>>(`analytics/${id}`);
  },

  // Get student performance analytics
  getStudentPerformanceAnalytics(filters?: {
    studentId?: number;
    period?: AnalyticsPeriod;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters?.studentId)
      queryParams.append("studentId", filters.studentId.toString());
    if (filters?.period) queryParams.append("period", filters.period);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const url = queryString
      ? `analytics/student/performance?${queryString}`
      : "analytics/student/performance";

    return api.get<SuccessResponse<Analytics[]>>(url);
  },

  // Get teacher performance analytics
  getTeacherPerformanceAnalytics(filters?: {
    teacherId?: number;
    department?: string;
    period?: AnalyticsPeriod;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters?.teacherId)
      queryParams.append("teacherId", filters.teacherId.toString());
    if (filters?.department)
      queryParams.append("department", filters.department);
    if (filters?.period) queryParams.append("period", filters.period);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const url = queryString
      ? `analytics/teacher/performance?${queryString}`
      : "analytics/teacher/performance";

    return api.get<SuccessResponse<Analytics[]>>(url);
  },

  // Get course analytics
  getCourseAnalytics(filters?: {
    courseId?: number;
    department?: string;
    period?: AnalyticsPeriod;
    startDate?: string;
    endDate?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters?.courseId)
      queryParams.append("courseId", filters.courseId.toString());
    if (filters?.department)
      queryParams.append("department", filters.department);
    if (filters?.period) queryParams.append("period", filters.period);
    if (filters?.startDate) queryParams.append("startDate", filters.startDate);
    if (filters?.endDate) queryParams.append("endDate", filters.endDate);

    const queryString = queryParams.toString();
    const url = queryString
      ? `analytics/course/analytics?${queryString}`
      : "analytics/course/analytics";

    return api.get<SuccessResponse<Analytics[]>>(url);
  },

  // Get department analytics
  getDepartmentAnalytics(department: string, period?: AnalyticsPeriod) {
    const queryParams = new URLSearchParams();
    if (period) queryParams.append("period", period);

    const queryString = queryParams.toString();
    const url = queryString
      ? `analytics/department/${department}?${queryString}`
      : `analytics/department/${department}`;

    return api.get<SuccessResponse<Analytics[]>>(url);
  },

  // Get semester summary
  getSemesterSummary(semester: string, year: number) {
    return api.get<SuccessResponse<Analytics[]>>(
      `analytics/semester/${semester}/${year}`
    );
  },

  // Get analytics trends
  getAnalyticsTrends(
    analyticsType: AnalyticsType,
    metric: string,
    period: AnalyticsPeriod,
    limit?: number
  ) {
    const queryParams = new URLSearchParams();
    queryParams.append("period", period);
    if (limit) queryParams.append("limit", limit.toString());

    return api.get<SuccessResponse<AnalyticsTrend[]>>(
      `analytics/trends/${analyticsType}/${metric}?${queryParams.toString()}`
    );
  },

  // Get comparative analytics
  getComparativeAnalytics(
    analyticsType: AnalyticsType,
    comparisonField: string,
    period: AnalyticsPeriod,
    startDate?: string,
    endDate?: string
  ) {
    const queryParams = new URLSearchParams();
    queryParams.append("period", period);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    return api.get<SuccessResponse<ComparativeAnalytics[]>>(
      `analytics/comparison/${analyticsType}/${comparisonField}?${queryParams.toString()}`
    );
  },

  // ETL Operations
  runFullETL() {
    return api.post<SuccessResponse<ETLJobResult>>(
      "analytics/etl/run-full",
      {}
    );
  },

  runIncrementalETL(lastRunDate: string) {
    return api.post<SuccessResponse<ETLJobResult>>(
      `analytics/etl/run-incremental?lastRunDate=${lastRunDate}`,
      {}
    );
  },

  runStudentAnalyticsETL() {
    return api.post<SuccessResponse<any>>(
      "analytics/etl/student-analytics",
      {}
    );
  },

  runTeacherAnalyticsETL() {
    return api.post<SuccessResponse<any>>(
      "analytics/etl/teacher-analytics",
      {}
    );
  },

  runCourseAnalyticsETL() {
    return api.post<SuccessResponse<any>>("analytics/etl/course-analytics", {});
  },

  runDepartmentAnalyticsETL() {
    return api.post<SuccessResponse<any>>(
      "analytics/etl/department-analytics",
      {}
    );
  },
};

const etlApi = {
  // Trigger ETL job
  triggerETL(request: ETLJobRequest) {
    return api.post<SuccessResponse<ETLJobResult>>("etl/trigger", request);
  },

  // Get ETL status
  getETLStatus() {
    return api.get<SuccessResponse<ETLStatus>>("etl/status");
  },

  // Schedule ETL job
  scheduleETL(schedule: {
    cronExpression: string;
    jobType: "FULL" | "INCREMENTAL";
    enabled: boolean;
  }) {
    return api.post<SuccessResponse<any>>("etl/schedule", schedule);
  },

  // Get scheduled jobs
  getScheduledJobs() {
    return api.get<SuccessResponse<any[]>>("etl/schedules");
  },

  // Test ETL connection
  testConnection() {
    return api.post<SuccessResponse<any>>("etl/test-connection", {});
  },
};

export { analyticsApi, etlApi };
