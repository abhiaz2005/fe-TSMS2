export const menuConfig = {
  VISITOR: [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
  ],

  USER: (userId) => [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Student",
      children: [
        { label: "Profile", path: `/student/${userId}` },
        { label: "Fees", path: `/student/fees/${userId}` },
        { label: "Report", path: `/student/report/${userId}` },
      ],
    },
  ],

  ADMIN: () => [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Student",
      children: [
        { label: "Students", path: "/students" },
        { label: "Reports", path: "/report" },
        { label: "Attendance", path: "/attendance" },
        { label: "Fees", path: "/student/fees" },
      ],
    },
  ],
};
