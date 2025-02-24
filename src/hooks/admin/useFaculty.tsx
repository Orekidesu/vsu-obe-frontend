import { useState, useCallback, useEffect } from "react";
import useApi from "../useApi";
import { parse } from "path";

interface Faculty {
  id: number;
  name: string;
  abbreviation: string;
}

const STORAGE_KEY = "faculty_data";

const useFaculty = () => {
  const api = useApi();

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cachedFaculties = localStorage.getItem(STORAGE_KEY);
    if (cachedFaculties) {
      const parsedFaculties = JSON.parse(cachedFaculties);

      setFaculties(parsedFaculties);
    }
  });
};
