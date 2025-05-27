"use client";

import { createContext, useContext, ReactNode } from "react";
import { createCourseRevisionStore } from "@/store/revision/course-revision-store";

type CourseRevisionStoreType = ReturnType<
  typeof createCourseRevisionStore
> | null;

const CourseRevisionStoreContext = createContext<CourseRevisionStoreType>(null);

export function CourseRevisionStoreProvider({
  children,
  store,
}: {
  children: ReactNode;
  store: CourseRevisionStoreType;
}) {
  return (
    <CourseRevisionStoreContext.Provider value={store}>
      {children}
    </CourseRevisionStoreContext.Provider>
  );
}

export function useCourseRevisionStore() {
  const store = useContext(CourseRevisionStoreContext);
  if (!store) {
    throw new Error(
      "useCourseRevisionStore must be used within a CourseRevisionStoreProvider"
    );
  }
  return store;
}
