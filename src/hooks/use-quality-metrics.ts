"use client";

import { useMemo } from "react";
import type { Student } from "@/contexts/student-context";
import type { Teacher } from "@/contexts/teacher-context";
import type { Curriculum } from "@/contexts/curriculum-context";

const QUALITY_THRESHOLDS = {
  gpa: { excellent: 3.6, good: 3.2, average: 2.8 },
  retention: { excellent: 95, good: 85, average: 75 },
  satisfaction: { excellent: 4.5, good: 4.0, average: 3.5 },
  utilization: { excellent: 85, good: 70, average: 50 },
  studentTeacherRatio: { excellent: 15, good: 20, average: 25 },
};

export function useQualityMetrics(
  students: Student[],
  teachers: Teacher[],
  curricula: Curriculum[]
) {
  // Quality Score Calculation
  const qualityMetrics = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === "active").length;
    const avgGPA =
      totalStudents > 0
        ? students.reduce((sum, s) => sum + s.gpa, 0) / totalStudents
        : 0;

    // Calculate student-teacher ratio (lower is better)
    const studentTeacherRatio =
      teachers.length > 0 ? totalStudents / teachers.length : 0;

    const retentionRate =
      totalStudents > 0 ? (activeStudents / totalStudents) * 100 : 0;
    const avgUtilization =
      curricula.length > 0
        ? (curricula.reduce(
            (sum, c) => sum + c.enrolledStudents.length / c.maxCapacity,
            0
          ) /
            curricula.length) *
          100
        : 0;

    // Calculate quality scores (0-100)
    const academicQuality = Math.min(100, (avgGPA / 4.0) * 100);

    // Teaching quality based on student-teacher ratio (inverse relationship)
    const teachingQuality = Math.min(
      100,
      Math.max(0, (30 - studentTeacherRatio) * 4)
    );

    const operationalQuality = Math.min(100, avgUtilization);
    const studentSatisfaction = Math.min(100, retentionRate);

    const overallQuality =
      (academicQuality +
        teachingQuality +
        operationalQuality +
        studentSatisfaction) /
      4;

    return {
      overall: Math.round(overallQuality),
      academic: Math.round(academicQuality),
      teaching: Math.round(teachingQuality),
      operational: Math.round(operationalQuality),
      satisfaction: Math.round(studentSatisfaction),
      avgGPA: Number(avgGPA.toFixed(2)),
      studentTeacherRatio: Number(studentTeacherRatio.toFixed(1)),
      retentionRate: Number(retentionRate.toFixed(1)),
      utilizationRate: Number(avgUtilization.toFixed(1)),
    };
  }, [students, teachers, curricula]);

  // Department Quality Analysis
  const departmentQuality = useMemo(() => {
    const deptData = {};

    students.forEach((student) => {
      if (!deptData[student.department]) {
        deptData[student.department] = {
          department: student.department,
          students: [],
          teachers: [],
          courses: [],
          totalGPA: 0,
          activeCount: 0,
          graduatedCount: 0,
        };
      }
      deptData[student.department].students.push(student);
      deptData[student.department].totalGPA += student.gpa;
      if (student.status === "active")
        deptData[student.department].activeCount++;
      if (student.status === "graduated")
        deptData[student.department].graduatedCount++;
    });

    teachers.forEach((teacher) => {
      if (deptData[teacher.department]) {
        deptData[teacher.department].teachers.push(teacher);
      }
    });

    curricula.forEach((curriculum) => {
      if (deptData[curriculum.department]) {
        deptData[curriculum.department].courses.push(curriculum);
      }
    });

    return Object.values(deptData)
      .map((dept: any) => {
        const avgGPA =
          dept.students.length > 0 ? dept.totalGPA / dept.students.length : 0;
        const studentTeacherRatio =
          dept.teachers.length > 0
            ? dept.students.length / dept.teachers.length
            : 0;
        const retentionRate =
          dept.students.length > 0
            ? (dept.activeCount / dept.students.length) * 100
            : 0;
        const avgUtilization =
          dept.courses.length > 0
            ? (dept.courses.reduce(
                (sum: number, c: any) =>
                  sum + c.enrolledStudents.length / c.maxCapacity,
                0
              ) /
                dept.courses.length) *
              100
            : 0;

        // Quality score calculation with student-teacher ratio instead of teacher rating
        const academicScore = (avgGPA / 4.0) * 25;
        const teachingScore = Math.max(0, 30 - studentTeacherRatio); // Better ratio = higher score
        const retentionScore = retentionRate * 0.25;
        const utilizationScore = avgUtilization * 0.25;

        const qualityScore =
          academicScore + teachingScore + retentionScore + utilizationScore;

        return {
          department: dept.department,
          shortName: dept.department.split(" ")[0],
          studentCount: dept.students.length,
          teacherCount: dept.teachers.length,
          courseCount: dept.courses.length,
          avgGPA: Number(avgGPA.toFixed(2)),
          studentTeacherRatio: Number(studentTeacherRatio.toFixed(1)),
          retentionRate: Number(retentionRate.toFixed(1)),
          utilizationRate: Number(avgUtilization.toFixed(1)),
          qualityScore: Math.round(qualityScore),
          qualityGrade:
            qualityScore >= 85
              ? "A"
              : qualityScore >= 75
              ? "B"
              : qualityScore >= 65
              ? "C"
              : qualityScore >= 55
              ? "D"
              : "F",
          riskLevel:
            qualityScore >= 75 ? "Low" : qualityScore >= 60 ? "Medium" : "High",
        };
      })
      .sort((a, b) => b.qualityScore - a.qualityScore);
  }, [students, teachers, curricula]);

  // Risk Assessment
  const riskAssessment = useMemo(() => {
    const risks = [];

    // Academic Performance Risks
    const lowGPADepts = departmentQuality.filter(
      (d) => d.avgGPA < QUALITY_THRESHOLDS.gpa.average
    );
    if (lowGPADepts.length > 0) {
      risks.push({
        type: "Academic",
        level: "High",
        description: `${lowGPADepts.length} departments with GPA below ${QUALITY_THRESHOLDS.gpa.average}`,
        departments: lowGPADepts.map((d) => d.department),
        impact: "Student Success",
        recommendation:
          "Implement academic support programs and review curriculum difficulty",
      });
    }

    // Retention Risks
    const lowRetentionDepts = departmentQuality.filter(
      (d) => d.retentionRate < QUALITY_THRESHOLDS.retention.average
    );
    if (lowRetentionDepts.length > 0) {
      risks.push({
        type: "Retention",
        level: "Medium",
        description: `${lowRetentionDepts.length} departments with retention below ${QUALITY_THRESHOLDS.retention.average}%`,
        departments: lowRetentionDepts.map((d) => d.department),
        impact: "Student Engagement",
        recommendation:
          "Develop student engagement initiatives and early intervention programs",
      });
    }

    // Student-Teacher Ratio Risks
    const highRatioDepts = departmentQuality.filter(
      (d) =>
        d.studentTeacherRatio > QUALITY_THRESHOLDS.studentTeacherRatio.average
    );
    if (highRatioDepts.length > 0) {
      risks.push({
        type: "Staffing",
        level: "Medium",
        description: `${highRatioDepts.length} departments with high student-teacher ratio`,
        departments: highRatioDepts.map((d) => d.department),
        impact: "Teaching Quality",
        recommendation:
          "Consider hiring additional faculty or restructuring class sizes",
      });
    }

    // Resource Utilization Risks
    const lowUtilizationDepts = departmentQuality.filter(
      (d) => d.utilizationRate < QUALITY_THRESHOLDS.utilization.average
    );
    if (lowUtilizationDepts.length > 0) {
      risks.push({
        type: "Resource",
        level: "Medium",
        description: `${lowUtilizationDepts.length} departments with low course utilization`,
        departments: lowUtilizationDepts.map((d) => d.department),
        impact: "Operational Efficiency",
        recommendation: "Review course offerings and optimize scheduling",
      });
    }

    return risks;
  }, [departmentQuality]);

  // Performance Trends (simulated data for demonstration)
  const performanceTrends = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    return months.map((month, index) => ({
      month,
      qualityScore: qualityMetrics.overall + (Math.random() - 0.5) * 10,
      academicPerformance: qualityMetrics.academic + (Math.random() - 0.5) * 8,
      teachingQuality: qualityMetrics.teaching + (Math.random() - 0.5) * 6,
      studentSatisfaction:
        qualityMetrics.satisfaction + (Math.random() - 0.5) * 12,
    }));
  }, [qualityMetrics]);

  return {
    qualityMetrics,
    departmentQuality,
    riskAssessment,
    performanceTrends,
  };
}
