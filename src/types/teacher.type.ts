// Teacher enums
export enum TeacherStatus {
  ACTIVE = "ACTIVE",
  ON_LEAVE = "ON_LEAVE",
  RETIRED = "RETIRED",
  TERMINATED = "TERMINATED",
}

export enum AcademicRank {
  INSTRUCTOR = "INSTRUCTOR",
  ASSISTANT_PROFESSOR = "ASSISTANT_PROFESSOR",
  ASSOCIATE_PROFESSOR = "ASSOCIATE_PROFESSOR",
  FULL_PROFESSOR = "FULL_PROFESSOR",
  EMERITUS = "EMERITUS",
}

export enum EducationLevel {
  MASTERS = "MASTERS",
  PHD = "PHD",
  DOCTORATE = "DOCTORATE",
}

export enum TeachingEvaluation {
  EXCELLENT = "EXCELLENT",
  VERY_GOOD = "VERY_GOOD",
  GOOD = "GOOD",
  SATISFACTORY = "SATISFACTORY",
  NEEDS_IMPROVEMENT = "NEEDS_IMPROVEMENT",
}

export enum ClassStatus {
  SCHEDULED = "SCHEDULED",
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Create Teacher DTO
export interface CreateTeacherDto {
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  address: string;
  hireDate: string;
  department: string;
  highestEducation?: EducationLevel;
  specialization: string;
  academicRank?: AcademicRank;
  salary: number;
  status?: TeacherStatus;
  yearsOfExperience?: number;
  profilePicture?: string;
  biography?: string;
}

// Update Teacher DTO
export interface UpdateTeacherDto {
  employeeId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  hireDate?: string;
  department?: string;
  highestEducation?: EducationLevel;
  specialization?: string;
  academicRank?: AcademicRank;
  salary?: number;
  status?: TeacherStatus;
  yearsOfExperience?: number;
  profilePicture?: string;
  biography?: string;
}

// Teacher Search DTO
export interface TeacherSearchDto {
  page?: number;
  limit?: number;
  search?: string;
}

// Course interface
export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  description?: string;
  department: string;
  prerequisites?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Study Record interface (for Class relation)
export interface StudyRecord {
  id: number;
  studentId: number;
  classId: number;
  semester: string;
  academicYear: number;
  grade?: string;
  gradePoints?: number;
  status: "ENROLLED" | "COMPLETED" | "WITHDRAWN" | "FAILED";
  createdAt: Date;
  updatedAt: Date;
}

// Class interface
export interface Class {
  id: number;
  classCode: string;
  courseId: number;
  course: Course;
  teacherId: number;
  teacher?: Teacher;
  semester: string;
  academicYear: number;
  startDate: Date;
  endDate: Date;
  schedule: string;
  location: string;
  minimumEnrollment: number;
  maximumEnrollment: number;
  currentEnrollment: number;
  status: ClassStatus;
  studyRecords: StudyRecord[];
  teachingRecords: TeachingRecord[];
  createdAt: Date;
  updatedAt: Date;
}

// Teaching Record interface
export interface TeachingRecord {
  id: number;
  teacherId: number;
  teacher: Teacher;
  classId: number;
  class: Class;

  // Student evaluation scores (out of 5.0)
  overallSatisfactionScore: number;
  teachingEffectivenessScore: number;
  courseMaterialQualityScore: number;
  communicationSkillsScore: number;
  availabilityHelpfulnessScore: number;
  fairnessGradingScore: number;

  // Class performance metrics
  classAverageScore: number;
  passRate: number;
  attendanceRate: number;
  totalStudentsEnrolled: number;
  studentsCompleted: number;
  studentsWithdrawn: number;

  // Feedback and evaluation
  evaluationResponseCount: number;
  studentFeedbackSummary?: string;
  positiveComments?: string;
  improvementSuggestions?: string;

  // Administrative evaluation
  administrativeEvaluation?: TeachingEvaluation;
  administratorComments?: string;

  // Professional development
  completedProfessionalDevelopment: boolean;
  professionalDevelopmentNotes?: string;

  // Goals and achievements
  semesterGoals?: string;
  achievementsHighlights?: string;
  challengesFaced?: string;
  improvementPlan?: string;

  createdAt: Date;
  updatedAt: Date;
}

// Main Teacher interface
export interface Teacher {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  hireDate: Date;
  department: string;
  highestEducation: EducationLevel;
  specialization: string;
  academicRank: AcademicRank;
  salary: number;
  status: TeacherStatus;
  overallRating: number;
  yearsOfExperience: number;
  profilePicture: string;
  biography: string;
  createdAt: Date;
  updatedAt: Date;
}

// Teacher Profile (with relations)
export interface TeacherProfile extends Teacher {
  classes: Class[];
  teachingRecords: TeachingRecord[];
}

// Performance Summary interface
export interface TeacherPerformanceSummary {
  teacher: TeacherProfile;
  performanceSummary: {
    overallRating: number;
    totalClassesTaught: number;
    currentlyTeaching: number;
    averageSatisfactionScore: number;
    averageTeachingEffectiveness: number;
    averageClassPerformance: number;
    averagePassRate: number;
    yearsOfExperience: number;
    academicRank: AcademicRank;
  };
  teachingRecords: TeachingRecord[];
  currentClasses: Class[];
}
