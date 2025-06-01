import { StudentBase } from "@/types/user";
import api from ".";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { cleanQueryParams } from "./hook";
import { stableSerialize } from "../utils";
import { fetchData } from "./api-crud";

export interface PaymentDetail {
  reference: string;
  student: StudentBase;
  fee: {
    id: string;
    name: string;
  };
  amount: number;
  paidAt: string | Date;
}

export async function fetchPaymentDetail(ref: string) {
  const res = await api.get<PaymentDetail>(`/payments/detail/${ref}`);

  if (res.status == 404) {
    throw new Error("Payment not found");
  }

  if (res.status != 200) {
    throw new Error("Erreur inconue", { cause: res.data });
  }

  return res.data;
}

export interface Payment {
  id: number;
  student: {
    id: number;
    firstname: string;
    lastname: string;
    matricule: string;
  };
  classe: {
    id: number;
    name: string;
  } | null;
  feesType: string;
  amount: number;
  method: string;
  transactionId?: string | null;
  status: "PEN" | "COM" | "FAI";
  createdAt: string;
  // Si vous voulez aussi exposer academic_year (venant de payment.fee.academic_year),
  // vous pouvez l’ajouter ici en tant que string.
  academicYear?: string;
}

export interface PaginatedPayments {
  count: number;
  items: Payment[];
}

export interface PaymentQueryParams {
  search?: string;
  classe?: number;
  academic_year?: string;
  transaction_id?: string;
  status?: string;
  date_from?: string; // "YYYY-MM-DD"
  date_to?: string; // "YYYY-MM-DD"
  limit?: number;
  offset?: number;
}

export function usePayments(
  params: PaymentQueryParams = {},
  options: Partial<UseQueryOptions<PaginatedPayments>> = {}
) {
  const cleanedParams = cleanQueryParams(params);
  return useQuery<PaginatedPayments>({
    queryKey: ["payments", stableSerialize(cleanedParams)],
    queryFn: async () => {
      const response = await fetchData<PaginatedPayments>(
        "/payments",
        cleanedParams
      );
      return response;
    },
    ...options,
  });
}

export interface PaymentStatsByStatus {
  count: number;
  totalAmount: number;
}

export interface PaymentTimeSeriesPoint {
  period: string; // "YYYY-MM-DD"
  count: number;
  totalAmount: number;
}

export interface PaymentDashboardStats {
  totalPayments: number;
  byStatus: Record<"pen" | "com" | "fai", PaymentStatsByStatus>;
  timeSeries: PaymentTimeSeriesPoint[];
}

export function usePaymentStats(
  options: Partial<UseQueryOptions<PaymentDashboardStats>> = {}
) {
  return useQuery<PaymentDashboardStats, Error>({
    queryKey: ["payments_stats"],
    queryFn: async () => {
      const response = await fetchData<PaymentDashboardStats>(
        "/payments/stats"
      );
      return response;
    },
    ...options,
  });
}
