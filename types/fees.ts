import { Classe } from "./classes"

export interface Fee{
  id: number
  name: string
  description?: string
  amount: number
  academicYear: string
  dueDate?: string | Date

  classe: Pick<Classe, 'id' | 'name'>
  feeType: FeeType
}

export interface FullFee extends Fee{
  createdAt: string | Date
  updatedAt: string | Date
}

export interface FeeType{
  id: number
  name: string
  description?: string
  isDueDateFixed?: boolean
  defaultDueDate?: string | Date
}

export interface FeesResponse{
  items: Fee[]
  count: number
}
