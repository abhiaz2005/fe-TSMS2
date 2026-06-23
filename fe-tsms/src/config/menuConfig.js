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
        { label: "Profile", path: `/students/${userId}` },
        { label: "Fees", path: `/students/fees/${userId}` },
        { label: "Report", path: `/students/report/${userId}` },
      ],
    },
  ],

  ADMIN: () => [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    {
      label: "Student",
      children: [
        { label: "Subject Management", path: "/subject" },
        { label: "Students", path: "/students" },
        { label: "Exams", path: "/exams" },
        { label: "Reports", path: "/report" },
        { label: "Attendance", path: "/attendance" },
        { label: "Fees", path: "/student/fees" },
        { label: "Classes", path: "/classes" },
      ],
    },
  ],
};
