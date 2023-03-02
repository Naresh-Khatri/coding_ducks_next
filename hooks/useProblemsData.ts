import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/axios'

export interface Exam {
  id: number
  slug: string
  title: string
  active?: boolean
  coverImg?: string
  description?: string
  durations?: number
  endTime?: string
  marks?: number
  startTime?: string
}
export interface Problem {
  id: number
  order: number
  difficulty: string
  description: string
  tags: string[]
  examId: number
  title: string
  exam: Exam
}

const queryFn = async (): Promise<any> => {
  const res = await axiosInstance.get('/problems')
  const problems: Problem[] = res.data
  const examsList = []
  problems?.forEach((problem) => {
    if (!examsList.find((e) => e.id === problem.examId))
      examsList.push({
        id: problem.examId,
        title: problem.exam.title,
        slug: problem.exam.slug,
      })
  })

  return { problems, examsList }
}
export const useProblemsData = () => {
  return useQuery({ queryKey: ['problems'], queryFn })
}