import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

export const useExamsData = () => {
  return useQuery(["exams"], () => axiosInstance.get("/exams"));
};

export const useExamData = (examSlug: string) => {
  return useQuery(["exam", examSlug], () =>
    axiosInstance.get(`/exams/slug/${examSlug}`)
  );
};

export const useExamProblemsData = ({ examId }: { examId: number }) => {
  return useQuery(
    ["examProblems", examId],
    () => axiosInstance.get(`/problems/examProblems/${examId}`),
    { refetchOnMount: false, enabled: false }
  );
};
export const useExamSubmissionsData = (examId: number) => {
  return useQuery(
    ["userSubmissions", examId],
    () => {
      return axiosInstance.get(`/exams/getProgress/${examId}`);
    },
    { enabled: !!examId }
  );
};
