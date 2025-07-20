// Student enums
export enum StudentStatus {
  ACTIVE = "ACTIVE",
  GRADUATED = "GRADUATED",
  SUSPENDED = "SUSPENDED",
  WITHDRAWN = "WITHDRAWN",
}

export enum YearLevel {
  FRESHMAN = "FRESHMAN",
  SOPHOMORE = "SOPHOMORE",
  JUNIOR = "JUNIOR",
  SENIOR = "SENIOR",
}

// Create Student DTO
export interface CreateStudentDto {
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth: string;
  address: string;
  enrollmentDate: string;
  currentYearLevel?: YearLevel;
  major: string;
  minor?: string;
  status?: StudentStatus;
  profilePicture?: string;
}

// Update Student DTO
export interface UpdateStudentDto {
  studentId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  enrollmentDate?: string;
  currentYearLevel?: YearLevel;
  major?: string;
  minor?: string;
  status?: StudentStatus;
  profilePicture?: string;
}

export interface StudentSearchDto {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Student {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  address: string;
  enrollmentDate: Date;
  currentYearLevel: YearLevel;
  major: string;
  minor: string;
  cumulativeGPA: number;
  totalCreditsEarned: number;
  status: StudentStatus;
  profilePicture: string;
  createdAt: Date;
  updatedAt: Date;
}

// Student Profile (with relations)
export interface StudentProfile extends Student {
  studyRecords: StudyRecord[];
}

// Study Record type
export interface StudyRecord {
  id: number;
  studentId: number;
  semester: string;
  academicYear: number;
  courses: Course[];
  totalCredits: number;
  gpa: number;
  status: "ENROLLED" | "COMPLETED" | "WITHDRAWN";
  createdAt: Date;
  updatedAt: Date;
}

// Course type for study records
export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  credits: number;
  grade?: string;
  gradePoints?: number;
  instructor: string;
  status: "ENROLLED" | "COMPLETED" | "DROPPED" | "FAILED";
}
