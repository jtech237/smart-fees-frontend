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
  count: number
  items: Array<Classe>
}

export interface ClasseItemResponse extends Classe{
  created_at: string
  updated_at: number
}


