export interface ParentClasse{
  id: number
  name: string
}
export interface Classe{
  id: number
  name: string
  depth: number
  parent: ParentClasse | null
}

export interface FullClasse extends Classe{
  createdAt: string | Date
  updatedAt: string | Date
}

export interface ClasseListResponse {
  total: number
  skip: number
  limit: number
  data: Array<Classe>
}

export interface ClasseItemResponse extends Classe{
  created_at: string
  updated_at: number
}


