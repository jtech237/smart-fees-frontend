import { StudentBase } from "@/types/user"
import api from "."

export interface PaymentDetail{
  reference: string
  student: StudentBase,
  fee: {
    id: string
    name: string
  }
  amount: number
  paidAt: string | Date
}

export async function fetchPaymentDetail(ref: string){
  const res = await api.get<PaymentDetail>(
    `/payments/detail/${ref}`,
  )

  if(res.status == 404){
    throw new Error("Payment not found")
  }

  if(res.status != 200){
    throw new Error("Erreur inconue", {cause: res.data})
  }

  return res.data
}
