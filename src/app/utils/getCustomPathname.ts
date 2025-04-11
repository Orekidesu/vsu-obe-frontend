const getCustomPathname = (path: string) => {
  if (path.startsWith("/admin")) {
    switch (path) {
      case "/admin":
        return "Dashboard";
      case "/admin/faculties-departments":
        return "Faculties and Departments";
      case "/admin/user-management":
        return "User Management";
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
      // case "/department/programs/active":
      //   return "Active Programs";
      // case "/department/programs/pending":
      //   return "Pending Programs";
      // case "/department/programs/add":
      //   return "Add Program";
      // case "/department/programs/archive":
      //   return "Archived";
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

  return "Unknown Path";
};

export default getCustomPathname;
