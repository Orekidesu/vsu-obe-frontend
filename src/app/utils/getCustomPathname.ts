const getCustomPathname = (path: string) => {
  if (path.startsWith("/admin")) {
    switch (path) {
      case "/admin":
        return "Dashboard";
      case "/admin/colleges_departments":
        return "Colleges and Departments";
      case "/admin/user_management":
        return "User Management";
      default:
        return "Unknown Path";
    }
  }
};

export default getCustomPathname;
