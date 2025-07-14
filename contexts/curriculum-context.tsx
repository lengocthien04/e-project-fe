"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export type CurriculumLevel = "undergraduate" | "graduate" | "doctoral"
export type CurriculumStatus = "active" | "inactive" | "under-review" | "archived"

export type Curriculum = {
  id: string
  name: string
  code: string
  description: string
  department: string
  level: CurriculumLevel
  credits: number
  duration: number // in weeks
  status: CurriculumStatus
  prerequisites: string[] // curriculum IDs
  teacherId: string
  enrolledStudents: string[] // student IDs
  maxCapacity: number
  schedule: {
    days: string[]
    time: string
    location: string
  }
  syllabus: string
  objectives: string[]
  assessmentMethods: string[]
  createdDate: string
  lastUpdated: string
  semester: string
  year: number
}

type CurriculumContextType = {
  curricula: Curriculum[]
  selectedCurricula: string[]
  setSelectedCurricula: (ids: string[]) => void
  updateCurriculum: (id: string, updates: Partial<Curriculum>) => void
  updateMultipleCurricula: (ids: string[], updates: Partial<Curriculum>) => void
  deleteCurriculum: (id: string) => void
  deleteMultipleCurricula: (ids: string[]) => void
  addCurriculum: (curriculum: Omit<Curriculum, "id">) => void
}

const CurriculumContext = createContext<CurriculumContextType | undefined>(undefined)

// Mock data
const mockCurricula: Curriculum[] = [
  {
    id: "c1",
    name: "Introduction to Programming",
    code: "CS101",
    description: "Fundamentals of programming using Python and basic algorithms",
    department: "Computer Science",
    level: "undergraduate",
    credits: 3,
    duration: 16,
    status: "active",
    prerequisites: [],
    teacherId: "t1",
    enrolledStudents: ["1", "2", "4"],
    maxCapacity: 50,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "9:00 AM - 10:00 AM",
      location: "CS Building, Room 101",
    },
    syllabus: "Week 1-4: Python basics, Week 5-8: Data structures, Week 9-12: Algorithms, Week 13-16: Projects",
    objectives: ["Understand programming fundamentals", "Implement basic algorithms", "Develop problem-solving skills"],
    assessmentMethods: ["Assignments (40%)", "Midterm (25%)", "Final Project (35%)"],
    createdDate: "2023-01-15",
    lastUpdated: "2023-08-20",
    semester: "Fall",
    year: 2023,
  },
  {
    id: "c2",
    name: "Data Structures and Algorithms",
    code: "CS201",
    description: "Advanced data structures and algorithm design and analysis",
    department: "Computer Science",
    level: "undergraduate",
    credits: 4,
    duration: 16,
    status: "active",
    prerequisites: ["c1"],
    teacherId: "t1",
    enrolledStudents: ["1", "3"],
    maxCapacity: 40,
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "2:00 PM - 3:30 PM",
      location: "CS Building, Room 201",
    },
    syllabus: "Advanced algorithms, complexity analysis, graph theory, dynamic programming",
    objectives: ["Master advanced data structures", "Analyze algorithm complexity", "Solve complex problems"],
    assessmentMethods: ["Weekly Quizzes (30%)", "Programming Assignments (40%)", "Final Exam (30%)"],
    createdDate: "2023-02-01",
    lastUpdated: "2023-08-25",
    semester: "Spring",
    year: 2024,
  },
  {
    id: "c3",
    name: "Engineering Mechanics",
    code: "ENG101",
    description: "Fundamental principles of statics and dynamics in engineering",
    department: "Engineering",
    level: "undergraduate",
    credits: 4,
    duration: 16,
    status: "active",
    prerequisites: [],
    teacherId: "t2",
    enrolledStudents: ["2", "5"],
    maxCapacity: 35,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "10:00 AM - 11:30 AM",
      location: "Engineering Hall, Room 105",
    },
    syllabus: "Statics, dynamics, force analysis, equilibrium, motion analysis",
    objectives: ["Understand mechanical principles", "Apply engineering analysis", "Solve real-world problems"],
    assessmentMethods: ["Lab Reports (25%)", "Midterm (35%)", "Final Exam (40%)"],
    createdDate: "2023-01-20",
    lastUpdated: "2023-09-01",
    semester: "Fall",
    year: 2023,
  },
  {
    id: "c4",
    name: "Thermodynamics",
    code: "ENG201",
    description: "Principles of thermodynamics and heat transfer",
    department: "Engineering",
    level: "undergraduate",
    credits: 3,
    duration: 16,
    status: "active",
    prerequisites: ["c3"],
    teacherId: "t2",
    enrolledStudents: ["2"],
    maxCapacity: 30,
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "1:00 PM - 2:30 PM",
      location: "Engineering Hall, Room 203",
    },
    syllabus: "Laws of thermodynamics, heat engines, refrigeration cycles, heat transfer",
    objectives: ["Master thermodynamic principles", "Analyze energy systems", "Design thermal systems"],
    assessmentMethods: ["Homework (20%)", "Midterm (35%)", "Final Project (45%)"],
    createdDate: "2023-03-01",
    lastUpdated: "2023-09-05",
    semester: "Spring",
    year: 2024,
  },
  {
    id: "c5",
    name: "Business Strategy",
    code: "BUS301",
    description: "Strategic management and competitive analysis",
    department: "Business",
    level: "undergraduate",
    credits: 3,
    duration: 16,
    status: "active",
    prerequisites: [],
    teacherId: "t3",
    enrolledStudents: ["3", "4", "5"],
    maxCapacity: 60,
    schedule: {
      days: ["Monday", "Wednesday"],
      time: "3:00 PM - 4:30 PM",
      location: "Business Center, Room 301",
    },
    syllabus: "Strategic planning, competitive analysis, market positioning, business models",
    objectives: ["Develop strategic thinking", "Analyze competitive landscapes", "Create business strategies"],
    assessmentMethods: ["Case Studies (40%)", "Group Project (35%)", "Final Exam (25%)"],
    createdDate: "2023-02-15",
    lastUpdated: "2023-08-30",
    semester: "Fall",
    year: 2023,
  },
  {
    id: "c6",
    name: "Cognitive Psychology",
    code: "PSY201",
    description: "Study of mental processes including perception, memory, and thinking",
    department: "Psychology",
    level: "undergraduate",
    credits: 3,
    duration: 16,
    status: "active",
    prerequisites: [],
    teacherId: "t4",
    enrolledStudents: ["4"],
    maxCapacity: 30,
    schedule: {
      days: ["Wednesday", "Friday"],
      time: "11:00 AM - 12:30 PM",
      location: "Psychology Building, Room 201",
    },
    syllabus: "Perception, attention, memory, language, problem solving, decision making",
    objectives: ["Understand cognitive processes", "Apply psychological theories", "Conduct research"],
    assessmentMethods: ["Research Paper (40%)", "Midterm (30%)", "Final Exam (30%)"],
    createdDate: "2023-01-25",
    lastUpdated: "2023-08-15",
    semester: "Spring",
    year: 2024,
  },
  {
    id: "c7",
    name: "Calculus I",
    code: "MATH101",
    description: "Differential and integral calculus of single variable functions",
    department: "Mathematics",
    level: "undergraduate",
    credits: 4,
    duration: 16,
    status: "active",
    prerequisites: [],
    teacherId: "t5",
    enrolledStudents: ["1", "2", "3", "5"],
    maxCapacity: 45,
    schedule: {
      days: ["Monday", "Wednesday", "Friday"],
      time: "8:00 AM - 9:00 AM",
      location: "Math Building, Room 101",
    },
    syllabus: "Limits, derivatives, applications of derivatives, integrals, fundamental theorem of calculus",
    objectives: ["Master calculus concepts", "Solve mathematical problems", "Apply calculus to real situations"],
    assessmentMethods: ["Homework (20%)", "Quizzes (25%)", "Midterm (25%)", "Final Exam (30%)"],
    createdDate: "2023-01-10",
    lastUpdated: "2023-08-10",
    semester: "Fall",
    year: 2023,
  },
  {
    id: "c8",
    name: "Linear Algebra",
    code: "MATH201",
    description: "Vector spaces, linear transformations, and matrix theory",
    department: "Mathematics",
    level: "undergraduate",
    credits: 3,
    duration: 16,
    status: "active",
    prerequisites: ["c7"],
    teacherId: "t5",
    enrolledStudents: ["1", "3"],
    maxCapacity: 35,
    schedule: {
      days: ["Tuesday", "Thursday"],
      time: "10:00 AM - 11:30 AM",
      location: "Math Building, Room 205",
    },
    syllabus: "Vector spaces, linear independence, matrix operations, eigenvalues, eigenvectors",
    objectives: ["Understand linear algebra concepts", "Solve systems of equations", "Apply to computer science"],
    assessmentMethods: ["Assignments (30%)", "Midterm (35%)", "Final Exam (35%)"],
    createdDate: "2023-02-20",
    lastUpdated: "2023-09-10",
    semester: "Spring",
    year: 2024,
  },
]

export function CurriculumProvider({ children }: { children: ReactNode }) {
  const [curricula, setCurricula] = useState<Curriculum[]>(mockCurricula)
  const [selectedCurricula, setSelectedCurricula] = useState<string[]>([])

  const updateCurriculum = (id: string, updates: Partial<Curriculum>) => {
    setCurricula((prev) =>
      prev.map((curriculum) => (curriculum.id === id ? { ...curriculum, ...updates } : curriculum)),
    )
  }

  const updateMultipleCurricula = (ids: string[], updates: Partial<Curriculum>) => {
    setCurricula((prev) =>
      prev.map((curriculum) => (ids.includes(curriculum.id) ? { ...curriculum, ...updates } : curriculum)),
    )
  }

  const deleteCurriculum = (id: string) => {
    setCurricula((prev) => prev.filter((curriculum) => curriculum.id !== id))
    setSelectedCurricula((prev) => prev.filter((selectedId) => selectedId !== id))
  }

  const deleteMultipleCurricula = (ids: string[]) => {
    setCurricula((prev) => prev.filter((curriculum) => !ids.includes(curriculum.id)))
    setSelectedCurricula([])
  }

  const addCurriculum = (curriculumData: Omit<Curriculum, "id">) => {
    const newCurriculum: Curriculum = {
      ...curriculumData,
      id: Date.now().toString(),
    }
    setCurricula((prev) => [...prev, newCurriculum])
  }

  return (
    <CurriculumContext.Provider
      value={{
        curricula,
        selectedCurricula,
        setSelectedCurricula,
        updateCurriculum,
        updateMultipleCurricula,
        deleteCurriculum,
        deleteMultipleCurricula,
        addCurriculum,
      }}
    >
      {children}
    </CurriculumContext.Provider>
  )
}

export function useCurricula() {
  const context = useContext(CurriculumContext)
  if (context === undefined) {
    throw new Error("useCurricula must be used within a CurriculumProvider")
  }
  return context
}
