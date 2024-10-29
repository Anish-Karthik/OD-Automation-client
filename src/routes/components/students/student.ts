export type StudentForm = {
  regNo: string;
  rollno: number;
  name: string;
  year: string;
  section: string;
  semester: string;
  batch: string;
  email: string | null;
  departmentId: string | null;
};

export type StudentUpdateForm = StudentForm & {
  id: string;
};

// Student type
export type Student = StudentUpdateForm & {
  vertical: string | null;
  userId: string;
  tutorId: string | null;
  yearInChargeId: string | null;
  departmentId: string | null;
};

export type Department = {
  id: string;
  name: string;
  code: string;
};
