const getCustomPathname = (path: string) => {
  if (path.startsWith("/admin")) {
    switch (path) {
      case "/admin":
        return "Dashboard";
      case "/admin/faculties_departments":
        return "Faculties and Departments";
      case "/admin/user_management":
        return "User Management";
      default:
        return "Unknown Path";
    }
  }
};

export default getCustomPathname;
