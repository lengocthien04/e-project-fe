import { StudyRecord } from "./student.type";
import { Teacher, TeachingRecord } from "./teacher.type";

export enum CourseLevel {
  UNDERGRADUATE = "UNDERGRADUATE",
  GRADUATE = "GRADUATE",
  DOCTORAL = "DOCTORAL",
}

export enum CourseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  ARCHIVED = "ARCHIVED",
}

// Base Course interface
export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  description: string;
  department: string;
  credits: number;
  level: CourseLevel;
  prerequisites?: string;
  status: CourseStatus;
  learningObjectives?: string;
  syllabus?: string;
  textbook?: string;
  minimumEnrollment: number;
  maximumEnrollment: number;
  createdAt: Date;
  updatedAt: Date;
}

// Course Profile with relations
export interface CourseProfile extends Course {
  classes: Class[];
}

// DTOs
export interface CreateCourseDto {
  courseCode: string;
  courseName: string;
  description: string;
  department: string;
  credits: number;
  level?: CourseLevel;
  prerequisites?: string;
  status?: CourseStatus;
  learningObjectives?: string;
  syllabus?: string;
  textbook?: string;
  minimumEnrollment?: number;
  maximumEnrollment?: number;
}

export interface UpdateCourseDto {
  courseCode?: string;
  courseName?: string;
  description?: string;
  department?: string;
  credits?: number;
  level?: CourseLevel;
  prerequisites?: string;
  status?: CourseStatus;
  learningObjectives?: string;
  syllabus?: string;
  textbook?: string;
  minimumEnrollment?: number;
  maximumEnrollment?: number;
}

export interface CourseSearchDto {
  page?: number;
  limit?: number;
  search?: string;
  department?: string;
  level?: CourseLevel;
  status?: CourseStatus;
}

export interface Class {
  id: number;
  classCode: string;
  courseId: number;
  course?: Course;
  teacherId: number;
  teacher?: Teacher; // Teacher type
  semester: string;
  academicYear: number;
  startDate: Date;
  endDate: Date;
  schedule: string;
  location: string;
  maxStudents: number;
  maxEnrollment: number;
  currentEnrollment: number;
  status: string;
  studyRecords: StudyRecord[];
  teachingRecords: TeachingRecord[];
  createdAt: Date;
  updatedAt: Date;
}
