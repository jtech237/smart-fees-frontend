export interface Cycle{
  id: number
  name: string
}

export type CycleListResponse =  Array<Cycle>

export interface CycleItemResponse extends Cycle{
  created_at: string
  updated_at: number
}
