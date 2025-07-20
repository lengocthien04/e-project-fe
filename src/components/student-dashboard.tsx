"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TeacherManagement } from "@/components/teacher/teacher-management";

import { Users, GraduationCap, BookOpen, UserCheck } from "lucide-react";
import StudentManagement from "./student/student-management";
import CurriculumManagement from "./curriculum/curriculum-management";
import { EducationAnalyticsDashboard } from "./dashboard/education-quality-dashboard";

export function StudentDashboard() {
  return (
    <div className="min-h-screen bg-inherit md:p-6 p-4 w-full">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between text-left ">
          <div>
            <h1 className="text-3xl font-bold !text-foreground text-left">
              Academic Management System
            </h1>
            <p className="text-secondary-foreground">
              Manage students, teachers, and curriculum
            </p>
          </div>
        </div>

        {/* Statistics Cards */}

        <Tabs defaultValue="students" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto sm:h-12 bg-blue-100 rounded-xl p-1 gap-1 sm:gap-0">
            <TabsTrigger
              value="students"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-lg py-3 sm:py-2"
            >
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Students</span>
            </TabsTrigger>
            <TabsTrigger
              value="teachers"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-lg py-3 sm:py-2"
            >
              <UserCheck className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Teachers</span>
            </TabsTrigger>
            <TabsTrigger
              value="curriculum"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-lg py-3 sm:py-2"
            >
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Curriculum</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex flex-col sm:flex-row items-center space-y-1 sm:space-y-0 sm:space-x-2 rounded-lg py-3 sm:py-2"
            >
              <GraduationCap className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students" className="space-y-6">
            <StudentManagement />
          </TabsContent>

          <TabsContent value="teachers">
            <TeacherManagement />
          </TabsContent>

          <TabsContent value="curriculum">
            <CurriculumManagement />
          </TabsContent>

          <TabsContent value="analytics">
            <EducationAnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
