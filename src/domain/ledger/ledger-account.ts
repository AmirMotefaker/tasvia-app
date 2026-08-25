export type LedgerAccountType =
  | "ASSET"
  | "LIABILITY"
  | "REVENUE"
  | "EXPENSE";

export interface LedgerAccount {
  id: string;
  name: string;
  type: LedgerAccountType;
  active: boolean;
}
