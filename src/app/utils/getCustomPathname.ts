const getCustomPathname = (path: string) => {
  if (path.startsWith("/admin")) {
    switch (path) {
      case "/admin":
        return "Dashboard";
      case "/admin/faculties-departments":
        return "Faculties and Departments";
      case "/admin/user-management":
        return "User Management";
      case "/admin/settings":
        return "Settings";
      default:
        return "Unknown Path";
    }
  }

  if (path.startsWith("/dean")) {
    // Check for dynamic paths with IDs
    if (path.match(/^\/dean\/proposals\/all-programs\/\d+\/revision$/)) {
      return `Program Proposal Revision`;
    }
    if (path.match(/^\/dean\/proposals\/all-syllabi\/\d+\/revision$/)) {
      return `Syllabus Proposal Revision`;
    }

    // Check for regular detail paths
    if (path.match(/^\/dean\/proposals\/all-programs\/\d+$/)) {
      return `Program Proposal Review`;
    }
    if (path.match(/^\/dean\/proposals\/all-syllabi\/\d+$/)) {
      return `Syllabus Proposal Review`;
    }

    switch (path) {
      case "/dean":
        return "Dashboard";
      case "/dean/programs":
        return "Active Programs";
      case "/dean/proposals/all-programs":
        return "Program Proposals";
      case "/dean/proposals/all-syllabi":
        return "Syllabi Proposals";
      case "/dean/settings":
        return "Settings";
      default:
        return "Unknown Path";
    }
  }
  if (path.startsWith("/department")) {
    switch (path) {
      case "/department":
        return "Dashboard";
      case "/department/programs/all-programs":
        return "All Programs";
      case "/department/programs/archive":
        return "Archived Programs";
      case "/department/courses":
        return "Courses";
      case "/department/committees":
        return "Committees";
      case "/department/settings":
        return "Settings";

      // Not visible to side bar
      case "/department/proposals/new-program":
        return "Propose Program Page";

      default:
        if (path.startsWith("/department/programs")) {
          return "Programs";
        }
        return "Dashboard";
    }
  }

  if (path.startsWith("/faculty")) {
    switch (path) {
      case "/faculty":
        return "Dashboard";
      case "/faculty/all-courses":
        return "Course Management";
      case "/faculty/syllabi/all-syllabi":
        return "All Syllabi";
      case "/faculty/syllabi/archive":
        return "Archived Syllabi";
      case "/faculty/settings":
        return "Settings";

      default:
        return "Dashboard";
    }
  }

  return "Unknown Path";
};

export default getCustomPathname;
