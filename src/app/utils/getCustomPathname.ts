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
};

export default getCustomPathname;
