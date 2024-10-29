import { api } from "@/lib/axios"
import { Student, StudentForm, StudentUpdateForm } from "@/routes/components/students/student";


export const fetchStudents = async (): Promise<Student[]> => {
  const res = await api.get("/user.student.list")
  return res.data.result.data
}

export const fetchDepartments = async () => {
  const res = await api.get("/department.getAll");
  return res.data.result.data;
};

export const createStudent = async (data: StudentForm) => {
  try {
    const res = await api.post("/user.student.create", {
      ...data,
      year: Number.parseInt(data.year),
      semester: Number.parseInt(data.semester),
    });
    return res.data.result;
  } catch (error) {
    console.error("Failed to create student:", error);
    throw error;
  }
};
export const updateStudent = async (data: StudentUpdateForm) => {
  try {
    const res = await api.post("/user.student.create", {
      ...data,
      year: Number.parseInt(data.year),
      semester: Number.parseInt(data.semester),
    });
    return res.data.result;
  } catch (error) {
    console.error("Failed to update student:", error);
    throw error;
  }
};

export const deleteStudent = async (id: string): Promise<void> => {
  await api.post("/user.delete", { id })
}


export const bulkCreateStudents = async (data: Student[]) => {
  try {
    // Convert batch values to strings
    const formattedData = data.map((student) => ({
      ...student,
      batch: student.batch.toString(),
      regNo: student.regNo.toString(),
    }));

    console.log("Bulk creating students:", formattedData);

    // Send the formatted data to the API
    const res = await api.post("/user.student.createMany", formattedData);
    return res.data.result;
  } catch (error) {
    console.error("Failed to bulk create students:", error);
    throw error;
  }
};