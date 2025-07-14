"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type TeacherStatus = "active" | "on-leave" | "retired" | "part-time";
export type TeacherSpecialization =
  | "Computer Science"
  | "Engineering"
  | "Business"
  | "Psychology"
  | "Mathematics"
  | "Physics"
  | "Chemistry"
  | "Biology";

export type Teacher = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  employeeId: string;
  department: string;
  specialization: TeacherSpecialization[];
  status: TeacherStatus;
  dateOfBirth: string;
  hireDate: string;
  salary: number;
  experience: number; // years
  education: string;
  coursesAssigned: string[]; // curriculum IDs
  studentsCount: number;
  officeLocation: string;
  officeHours: string;
  avatar?: string;
};

type TeacherContextType = {
  teachers: Teacher[];
  selectedTeachers: string[];
  setSelectedTeachers: (ids: string[]) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  updateMultipleTeachers: (ids: string[], updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  deleteMultipleTeachers: (ids: string[]) => void;
  addTeacher: (teacher: Omit<Teacher, "id">) => void;
};

const TeacherContext = createContext<TeacherContextType | undefined>(undefined);

// Mock data
const mockTeachers: Teacher[] = [
  {
    id: "t1",
    firstName: "Dr. Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 234-5678",
    employeeId: "EMP001",
    department: "Computer Science",
    specialization: ["Computer Science"],
    status: "active",
    dateOfBirth: "1980-03-15",
    hireDate: "2015-08-01",
    salary: 85000,
    experience: 12,
    education: "PhD in Computer Science",

    coursesAssigned: ["c1", "c2"],
    studentsCount: 45,
    officeLocation: "CS Building, Room 301",
    officeHours: "Mon-Wed 2-4 PM",
  },
  {
    id: "t2",
    firstName: "Prof. Michael",
    lastName: "Chen",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 345-6789",
    employeeId: "EMP002",
    department: "Engineering",
    specialization: ["Engineering", "Mathematics"],
    status: "active",
    dateOfBirth: "1975-11-22",
    hireDate: "2010-01-15",
    salary: 92000,
    experience: 18,
    education: "PhD in Mechanical Engineering",

    coursesAssigned: ["c3", "c4"],
    studentsCount: 38,
    officeLocation: "Engineering Hall, Room 205",
    officeHours: "Tue-Thu 1-3 PM",
  },
  {
    id: "t3",
    firstName: "Dr. Emily",
    lastName: "Davis",
    email: "emily.davis@university.edu",
    phone: "+1 (555) 456-7890",
    employeeId: "EMP003",
    department: "Business",
    specialization: ["Business"],
    status: "active",
    dateOfBirth: "1982-07-08",
    hireDate: "2018-09-01",
    salary: 78000,
    experience: 8,
    education: "MBA, PhD in Business Administration",

    coursesAssigned: ["c5"],
    studentsCount: 52,
    officeLocation: "Business Center, Room 412",
    officeHours: "Mon-Fri 10-12 PM",
  },
  {
    id: "t4",
    firstName: "Prof. David",
    lastName: "Wilson",
    email: "david.wilson@university.edu",
    phone: "+1 (555) 567-8901",
    employeeId: "EMP004",
    department: "Psychology",
    specialization: ["Psychology"],
    status: "part-time",
    dateOfBirth: "1970-12-03",
    hireDate: "2012-03-01",
    salary: 45000,
    experience: 15,
    education: "PhD in Clinical Psychology",

    coursesAssigned: ["c6"],
    studentsCount: 28,
    officeLocation: "Psychology Building, Room 108",
    officeHours: "Wed-Fri 9-11 AM",
  },
  {
    id: "t5",
    firstName: "Dr. Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@university.edu",
    phone: "+1 (555) 678-9012",
    employeeId: "EMP005",
    department: "Mathematics",
    specialization: ["Mathematics", "Physics"],
    status: "active",
    dateOfBirth: "1978-05-20",
    hireDate: "2016-01-10",
    salary: 81000,
    experience: 10,
    education: "PhD in Applied Mathematics",

    coursesAssigned: ["c7", "c8"],
    studentsCount: 41,
    officeLocation: "Math Building, Room 203",
    officeHours: "Mon-Wed-Fri 11-1 PM",
  },
];

export function TeacherProvider({ children }: { children: ReactNode }) {
  const [teachers, setTeachers] = useState<Teacher[]>(mockTeachers);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        teacher.id === id ? { ...teacher, ...updates } : teacher
      )
    );
  };

  const updateMultipleTeachers = (ids: string[], updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((teacher) =>
        ids.includes(teacher.id) ? { ...teacher, ...updates } : teacher
      )
    );
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((teacher) => teacher.id !== id));
    setSelectedTeachers((prev) =>
      prev.filter((selectedId) => selectedId !== id)
    );
  };

  const deleteMultipleTeachers = (ids: string[]) => {
    setTeachers((prev) => prev.filter((teacher) => !ids.includes(teacher.id)));
    setSelectedTeachers([]);
  };

  const addTeacher = (teacherData: Omit<Teacher, "id">) => {
    const newTeacher: Teacher = {
      ...teacherData,
      id: Date.now().toString(),
    };
    setTeachers((prev) => [...prev, newTeacher]);
  };

  return (
    <TeacherContext.Provider
      value={{
        teachers,
        selectedTeachers,
        setSelectedTeachers,
        updateTeacher,
        updateMultipleTeachers,
        deleteTeacher,
        deleteMultipleTeachers,
        addTeacher,
      }}
    >
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeachers() {
  const context = useContext(TeacherContext);
  if (context === undefined) {
    throw new Error("useTeachers must be used within a TeacherProvider");
  }
  return context;
}
