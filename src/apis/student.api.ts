import { api } from "@/lib/api-client";
import {
  Student,
  StudentProfile,
  StudyRecord,
  CreateStudentDto,
  UpdateStudentDto,
  StudentSearchDto,
  StudentStatus,
} from "../types/student.type";
import { SuccessResponse } from "@/types/common";

const studentApi = {
  // Create a new student
  createStudent(body: CreateStudentDto) {
    return api.post<SuccessResponse<Student>>("students", body);
  },

  // Get all students with pagination and search
  getAllStudents(params?: StudentSearchDto) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `students?${queryString}` : "students";

    return api.get<SuccessResponse<Student[]>>(url);
  },

  // Search student by student ID
  findByStudentId(studentId: string) {
    return api.get<SuccessResponse<Student>>(
      `students/search?studentId=${studentId}`
    );
  },

  // Get student by ID
  getStudentById(id: number) {
    return api.get<SuccessResponse<Student>>(`students/${id}`);
  },

  // Get student profile
  getStudentProfile(id: number) {
    return api.get<SuccessResponse<StudentProfile>>(`students/${id}/profile`);
  },

  // Get student study records
  getStudentStudyRecords(id: number) {
    return api.get<SuccessResponse<StudyRecord[]>>(
      `students/${id}/study-records`
    );
  },

  // Update student
  updateStudent(id: number, body: UpdateStudentDto) {
    return api.patch<SuccessResponse<Student>>(`students/${id}`, body);
  },

  // Update student status
  updateStudentStatus(id: number, status: StudentStatus) {
    return api.patch<SuccessResponse<Student>>(`students/${id}/status`, {
      status,
    });
  },

  // Delete student
  deleteStudent(id: number) {
    return api.delete<SuccessResponse<null>>(`students/${id}`);
  },
};

export default studentApi;
