import { Classe } from "./classes"

export interface Classroom{
  id: number
  name: string
  classe: Pick<Classe, "id" | "name">
}

export interface FullClassroom extends Classroom{
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ClassroomListResponse{
  total: number
  skip: number
  limit: number
  data: Array<Classroom>
}

export interface ClasseroomItemResponse extends Classroom{
  created_at: string
  updated_at: number
}
