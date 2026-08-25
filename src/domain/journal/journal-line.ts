import type { Money } from "../financial-safety/money";
export type JournalDirection = "DEBIT" | "CREDIT";
export interface JournalLine {
 id:string;
 journalEntryId:string;
 accountId:string;
 direction:JournalDirection;
 amount:Money;
}
