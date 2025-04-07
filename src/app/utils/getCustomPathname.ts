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
      case "/department/programs/active":
        return "Active Programs";
      case "/department/programs/pending":
        return "Pending Programs";
      case "/department/programs/add":
        return "Add Program";
      case "/department/committees":
        return "Committees";
      default:
        if (path.startsWith("/department/programs")) {
          return "Programs";
        }
        return "Unknown Path";
    }
  }

  return "Unknown Path";
};

export default getCustomPathname;
