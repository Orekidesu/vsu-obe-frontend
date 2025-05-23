import { useQuery } from "@tanstack/react-query";
import { Semester } from "@/types/model/Semester";
import useApi from "../useApi";

const useSemesters = () => {
  const api = useApi();

  const {
    data: semesters,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["semesters"],
    queryFn: async () => {
      const response = await api.get<{ data: Semester[] }>(
        "department/semesters"
      );

      return response.data.data;
    },
  });

  return {
    semesters,
    isLoading,
    error,
  };
};

export default useSemesters;
