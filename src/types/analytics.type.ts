// src/types/analytics.type.ts

export enum AnalyticsType {
  STUDENT_PERFORMANCE = "STUDENT_PERFORMANCE",
  TEACHER_PERFORMANCE = "TEACHER_PERFORMANCE",
  COURSE_ANALYTICS = "COURSE_ANALYTICS",
  CLASS_ANALYTICS = "CLASS_ANALYTICS",
  DEPARTMENT_ANALYTICS = "DEPARTMENT_ANALYTICS",
  SEMESTER_SUMMARY = "SEMESTER_SUMMARY",
}

export enum AnalyticsPeriod {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  SEMESTER = "SEMESTER",
  YEARLY = "YEARLY",
}

export interface Analytics {
  id: number;
  analyticsType: AnalyticsType;
  period: AnalyticsPeriod;
  periodStart: string;
  periodEnd: string;

  // Reference IDs
  studentId?: number;
  teacherId?: number;
  courseId?: number;
  classId?: number;
  department?: string;
  semester?: string;
  academicYear?: number;

  // Student Performance Metrics
  averageGPA?: number;
  averageAttendance?: number;
  totalStudents?: number;
  passedStudents?: number;
  failedStudents?: number;
  passRate?: number;
  dropoutRate?: number;

  // Grade Distribution
  gradeA: number;
  gradeB: number;
  gradeC: number;
  gradeD: number;
  gradeF: number;

  // Teacher Performance Metrics
  teacherRating?: number;
  classAverageScore?: number;
  totalClassesTaught?: number;
  totalStudentsTaught?: number;

  // Course Analytics
  enrollmentRate?: number;
  totalEnrollments?: number;
  completedEnrollments?: number;
  withdrawnEnrollments?: number;
  courseSatisfactionScore?: number;

  // Assessment Metrics
  averageAssignmentScore?: number;
  averageMidtermScore?: number;
  averageFinalScore?: number;
  averageQuizScore?: number;
  averageProjectScore?: number;

  // Resource Utilization
  classroomUtilization?: number;
  teacherWorkload?: number;

  // Financial Metrics
  revenue?: number;
  costPerStudent?: number;

  // Quality Indicators
  studentRetentionRate?: number;
  graduationRate?: number;
  employmentRate?: number;

  // Metadata
  dataExtractedAt: string;
  lastUpdated?: string;
  etlJobId?: string;
  processingMetadata?: any;

  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsFilters {
  analyticsType?: AnalyticsType;
  period?: AnalyticsPeriod;
  department?: string;
  startDate?: string;
  endDate?: string;
  studentId?: number;
  teacherId?: number;
  courseId?: number;
}

export interface QualityMetrics {
  overall: number;
  academic: number;
  teaching: number;
  operational: number;
  satisfaction: number;
  avgGPA: number;
  avgTeacherRating: number;
  retentionRate: number;
  utilizationRate: number;
}

export interface DepartmentQuality {
  department: string;
  shortName: string;
  qualityScore: number;
  qualityGrade: string;
  riskLevel: string;
  studentCount: number;
  teacherCount: number;
  avgGPA: number;
  retentionRate: number;
  utilizationRate: number;
  studentTeacherRatio: number;
}

export interface PerformanceTrend {
  month: string;
  qualityScore: number;
  academicPerformance: number;
  teachingQuality: number;
  studentSatisfaction: number;
  operationalEfficiency: number;
}

export interface RiskAssessment {
  type: string;
  level: "Low" | "Medium" | "High";
  description: string;
  departments: string[];
  impact: string;
  recommendation: string;
}

export interface ETLJobResult {
  jobId: string;
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  errors: string[];
  executionTime: number;
  message: string;
}

export interface ETLJobRequest {
  jobType:
    | "FULL"
    | "INCREMENTAL"
    | "STUDENT"
    | "TEACHER"
    | "COURSE"
    | "DEPARTMENT"
    | "SEMESTER";
  lastRunDate?: string;
  parameters?: any;
}

export interface ETLStatus {
  isRunning: boolean;
  lastRun: string | null;
  scheduledJobs: string[];
  systemHealth: string;
  uptime: number;
}

export interface AnalyticsTrend {
  period: string;
  value: number;
  periodLabel: string;
}

export interface ComparativeAnalytics {
  department?: string;
  averageGPA: number;
  passRate: number;
  attendanceRate: number;
  enrollmentRate: number;
  recordCount: number;
}
