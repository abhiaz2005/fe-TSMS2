export const url = {
    registerUser: "/auth/register",
    login: "auth/login",
    //student
    getStudentById: "api/get/student",
    getAllStudent: "api/get/all/student",
    updateStudent: "/api/update/user",
    getAllFees: "api/fees/all",
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
    getGroupedSubjects:"api/class-subject/group/by/subject",
    deleteAllClassSubjectBySubject: "/api/class-subject/delete/all/by/subjectId",
    getClassSubjectBySubject: "/api/class-subject/by-subject",
}