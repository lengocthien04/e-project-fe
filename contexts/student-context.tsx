"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type StudentStatus = "active" | "graduated" | "on-leave" | "dropped-out" | "currently-working"

export type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  studentId: string
  department: string
  year: number
  gpa: number
  status: StudentStatus
  dateOfBirth: string
  address: string
  emergencyContact: string
  emergencyPhone: string
  enrollmentDate: string
  graduationDate?: string
  avatar?: string
}

type StudentContextType = {
  students: Student[]
  selectedStudents: string[]
  setSelectedStudents: (ids: string[]) => void
  updateStudent: (id: string, updates: Partial<Student>) => void
  updateMultipleStudents: (ids: string[], updates: Partial<Student>) => void
  deleteStudent: (id: string) => void
  deleteMultipleStudents: (ids: string[]) => void
  addStudent: (student: Omit<Student, "id">) => void
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

// Mock data
const mockStudents: Student[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    studentId: "STU001",
    department: "Computer Science",
    year: 3,
    gpa: 3.8,
    status: "active",
    dateOfBirth: "2001-05-15",
    address: "123 Campus Drive, University City, UC 12345",
    emergencyContact: "Jane Doe",
    emergencyPhone: "+1 (555) 987-6543",
    enrollmentDate: "2021-09-01",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 234-5678",
    studentId: "STU002",
    department: "Engineering",
    year: 4,
    gpa: 3.9,
    status: "currently-working",
    dateOfBirth: "2000-08-22",
    address: "456 Oak Street, University City, UC 12345",
    emergencyContact: "Robert Johnson",
    emergencyPhone: "+1 (555) 876-5432",
    enrollmentDate: "2020-09-01",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 345-6789",
    studentId: "STU003",
    department: "Business",
    year: 2,
    gpa: 3.6,
    status: "on-leave",
    dateOfBirth: "2002-12-10",
    address: "789 Pine Avenue, University City, UC 12345",
    emergencyContact: "Lisa Chen",
    emergencyPhone: "+1 (555) 765-4321",
    enrollmentDate: "2022-09-01",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@university.edu",
    phone: "+1 (555) 456-7890",
    studentId: "STU004",
    department: "Psychology",
    year: 1,
    gpa: 3.7,
    status: "active",
    dateOfBirth: "2003-03-18",
    address: "321 Elm Street, University City, UC 12345",
    emergencyContact: "Mark Davis",
    emergencyPhone: "+1 (555) 654-3210",
    enrollmentDate: "2023-09-01",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@university.edu",
    phone: "+1 (555) 567-8901",
    studentId: "STU005",
    department: "Computer Science",
    year: 4,
    gpa: 3.5,
    status: "graduated",
    dateOfBirth: "1999-11-05",
    address: "654 Maple Drive, University City, UC 12345",
    emergencyContact: "Susan Wilson",
    emergencyPhone: "+1 (555) 543-2109",
    enrollmentDate: "2019-09-01",
    graduationDate: "2023-05-15",
  },
]

export function StudentProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((student) => (student.id === id ? { ...student, ...updates } : student)))
  }

  const updateMultipleStudents = (ids: string[], updates: Partial<Student>) => {
    setStudents((prev) => prev.map((student) => (ids.includes(student.id) ? { ...student, ...updates } : student)))
  }

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((student) => student.id !== id))
    setSelectedStudents((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  const deleteMultipleStudents = (ids: string[]) => {
    setStudents((prev) => prev.filter((student) => !ids.includes(student.id)))
    setSelectedStudents([])
  }

  const addStudent = (studentData: Omit<Student, "id">) => {
    const newStudent: Student = {
      ...studentData,
      id: Date.now().toString(),
    }
    setStudents((prev) => [...prev, newStudent])
  }

  return (
    <StudentContext.Provider
      value={{
        students,
        selectedStudents,
        setSelectedStudents,
        updateStudent,
        updateMultipleStudents,
        deleteStudent,
        deleteMultipleStudents,
        addStudent,
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudents() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error("useStudents must be used within a StudentProvider")
  }
  return context
}
