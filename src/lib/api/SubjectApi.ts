import { api } from "@/lib/axios"
import { SubjectSchema ,Subject} from "@/routes/components/subjects/subject"


export const fetchSubjects = async (): Promise<Subject[]> => {
  
  const res = await api.get("/subject.list");
  console.log(res.data.result.data)
  return res.data.result.data;
}

export const createSubject = async (data: SubjectSchema): Promise<Subject> => {
  
  const res = await api.post("/subject.create", data);
  return res.data.result;
}

export const updateSubject = async (data: Subject): Promise<Subject> => {
    
    const res = await api.post("/subject.create", data);
    return res.data.result;
 
}

export const deleteSubject = async (id: string): Promise<void> => {
  await api.post("/subject.delete", { id })
 
}