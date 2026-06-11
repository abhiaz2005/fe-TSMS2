export const url = {
    registerUser: "/auth/register",
    login: "auth/login",
    //user
    getStudentById: "api/get/student",
    getAllStudent: "api/get/all/student",
    updateStudent: "/api/update/user",
    //fees
    getAllFees: "api/fees/all",
    getStudent: "/api/get/student",
    getStudentFeeById:"api/fees",
    //otp
    verifyOtp: "verify/otp",
    //exam
    addExam: "api/exam/add",
    getAllExam: "api/exam/all",
    editExam: "api/exam/edit",
    deleteExam: "api/exam/delete",
    //class
    addClass: "/api/add/class",
    deleteClass: "/api/delete/class",
    getAllClass: "/api/get/all/class",
    addFees: "api/fees/add",
    //subject
    getAllSubject: "/api/subject/all",
    addSubject: "/api/subject/add",
    editSubject: "/api/subject/edit",
    deleteSubject: "/api/subject/delete",
    //class - subject
    addClassSubject: "/api/class-subject/add",
    editClassSubject: "/api/class-subject/edit",
    deleteClassSubject: "/api/class-subject/delete",
    getGroupedSubjects: "api/class-subject/group/by/subject",
    deleteAllClassSubjectBySubject: "/api/class-subject/delete/all/by/subjectId",
    getClassSubjectBySubject: "/api/class-subject/by-subject",
    //marks
    getAllMarks: "/api/marks/all",
    addMarks: "/api/marks/add",
    editMark: "/api/marks/edit",
    deleteMark: "/api/marks/delete",
    generateReport: "/api/generate/report",
    getStudentReport: "/api/marks/student", 
}