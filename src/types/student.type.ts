export type Student = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  studentId: string;
  department: string;
  year: number;
  gpa: number;
  status: StudentStatus;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  enrollmentDate: string;
  graduationDate?: string;
  avatar?: string;
};

export type StudentStatus =
  | "active"
  | "graduated"
  | "on-leave"
  | "dropped-out"
  | "currently-working";
