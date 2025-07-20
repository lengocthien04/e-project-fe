import { api } from "@/lib/api-client";
import {
  Course,
  CourseProfile,
  Class,
  CreateCourseDto,
  UpdateCourseDto,
  CourseSearchDto,
  CourseStatus,
} from "../types/course.type";
import { SuccessResponse } from "@/types/common";
const courseApi = {
  // Create a new course
  createCourse(body: CreateCourseDto) {
    return api.post<SuccessResponse<Course>>("courses", body);
  },

  // Get all courses with pagination and search
  getAllCourses(params?: CourseSearchDto) {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.department) queryParams.append("department", params.department);
    if (params?.level) queryParams.append("level", params.level);
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = queryString ? `courses?${queryString}` : "courses";

    return api.get<SuccessResponse<Course[]>>(url);
  },

  // Get departments
  getDepartments() {
    return api.get<SuccessResponse<string[]>>("courses/departments");
  },

  // Get active courses
  getActiveCourses() {
    return api.get<SuccessResponse<Course[]>>("courses/active");
  },

  // Get courses by department
  getCoursesByDepartment(department: string) {
    return api.get<SuccessResponse<Course[]>>(
      `courses/department/${department}`
    );
  },

  // Search course by course code
  findByCourseCode(courseCode: string) {
    return api.get<SuccessResponse<Course>>(
      `courses/search?courseCode=${courseCode}`
    );
  },

  // Get course by ID
  getCourseById(id: number) {
    return api.get<SuccessResponse<Course>>(`courses/${id}`);
  },

  // Get course profile
  getCourseProfile(id: number) {
    return api.get<SuccessResponse<CourseProfile>>(`courses/${id}/profile`);
  },

  // Get course classes
  getCourseClasses(id: number) {
    return api.get<SuccessResponse<Class[]>>(`courses/${id}/classes`);
  },

  // Update course
  updateCourse(id: number, body: UpdateCourseDto) {
    return api.patch<SuccessResponse<Course>>(`courses/${id}`, body);
  },

  // Update course status
  updateCourseStatus(id: number, status: CourseStatus) {
    return api.patch<SuccessResponse<Course>>(`courses/${id}/status`, {
      status,
    });
  },

  // Delete course
  deleteCourse(id: number) {
    return api.delete<SuccessResponse<null>>(`courses/${id}`);
  },
};

export default courseApi;
