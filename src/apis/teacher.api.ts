import { api } from "@/lib/api-client";
import { SuccessResponse } from "@/types/common";
import {
  Class,
  CreateTeacherDto,
  Teacher,
  TeacherPerformanceSummary,
  TeacherProfile,
  TeacherSearchDto,
  TeachingRecord,
} from "@/types/teacher.type";

const teacherApi = {
  // Create a new teacher
  createTeacher(body: CreateTeacherDto) {
    return api.post<SuccessResponse<Teacher>>("teachers", body);
  },

  // Get all teachers with pagination and search
  getAllTeachers(params?: TeacherSearchDto) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);

    const queryString = queryParams.toString();
    const url = queryString ? `teachers?${queryString}` : "teachers";

    return api.get<SuccessResponse<Teacher[]>>(url);
  },

  // Search teacher by employee ID
  findByEmployeeId(employeeId: string) {
    return api.get<SuccessResponse<Teacher>>(
      `teachers/search?employeeId=${employeeId}`
    );
  },

  // Get teachers by department
  getTeachersByDepartment(department: string) {
    return api.get<SuccessResponse<Teacher[]>>(
      `teachers/department/${department}`
    );
  },

  // Get top performing teachers
  getTopPerformingTeachers(limit: number = 10) {
    return api.get<SuccessResponse<Teacher[]>>(
      `teachers/top-performers?limit=${limit}`
    );
  },

  // Get teacher by ID
  getTeacherById(id: number) {
    return api.get<SuccessResponse<Teacher>>(`teachers/${id}`);
  },

  // Get teacher profile (with relations)
  getTeacherProfile(id: number) {
    return api.get<SuccessResponse<TeacherProfile>>(`teachers/${id}/profile`);
  },

  // Get teacher teaching records
  getTeacherTeachingRecords(id: number) {
    return api.get<SuccessResponse<TeachingRecord[]>>(
      `teachers/${id}/teaching-records`
    );
  },

  // Get teacher teaching records by semester
  getTeacherTeachingRecordsBySemester(
    id: number,
    semester: string,
    academicYear: number
  ) {
    const queryParams = new URLSearchParams();
    queryParams.append("semester", semester);
    queryParams.append("academicYear", academicYear.toString());

    return api.get<SuccessResponse<TeachingRecord[]>>(
      `teachers/${id}/teaching-records/semester?${queryParams.toString()}`
    );
  },

  // Get teacher current classes
  getTeacherCurrentClasses(id: number) {
    return api.get<SuccessResponse<Class[]>>(`teachers/${id}/current-classes`);
  },

  // Get teacher class history
  getTeacherClassHistory(id: number) {
    return api.get<SuccessResponse<Class[]>>(`teachers/${id}/class-history`);
  },

  // Get teacher performance summary
  getTeacherPerformanceSummary(id: number) {
    return api.get<SuccessResponse<TeacherPerformanceSummary>>(
      `teachers/${id}/performance-summary`
    );
  },

  // Delete teacher
  deleteTeacher(id: number) {
    return api.delete<SuccessResponse<null>>(`teachers/${id}`);
  },
};

export default teacherApi;
