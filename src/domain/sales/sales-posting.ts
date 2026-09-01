import type { Money } from "../financial-safety/money";
import type { JournalEntry } from "../journal/journal-entry";
import type { JournalLine } from "../journal/journal-line";
import { validateDoubleEntry } from "../journal/journal-validation";

export interface SalesPostingAccounts {
  receivablesAccountId: string;
  revenueAccountId: string;
}

export interface SimpleSaleInput {
  id: string;
  reference: string;
  description: string;
  amount: Money;
  createdAt: Date;
  accounts: SalesPostingAccounts;
}

export function buildSaleJournal(input: SimpleSaleInput): JournalEntry {
  if (input.amount.minorUnits <= BigInt(0)) throw new Error("Sale amount must be positive.");
  if (!input.accounts.receivablesAccountId.trim() || !input.accounts.revenueAccountId.trim()) {
    throw new Error("Sales posting accounts are required.");
  }
  if (input.accounts.receivablesAccountId === input.accounts.revenueAccountId) {
    throw new Error("Receivable and revenue accounts must be different.");
  }

  const lines: JournalLine[] = [
    {
      id: `${input.id}:debit`,
      journalEntryId: input.id,
      accountId: input.accounts.receivablesAccountId,
      direction: "DEBIT",
      amount: input.amount,
    },
    {
      id: `${input.id}:credit`,
      journalEntryId: input.id,
      accountId: input.accounts.revenueAccountId,
      direction: "CREDIT",
      amount: input.amount,
    },
  ];

  const entry: JournalEntry = {
    id: input.id,
    reference: input.reference,
    description: input.description,
    status: "DRAFT",
    lines,
    createdAt: input.createdAt,
  };

  if (!validateDoubleEntry(entry)) throw new Error("Sale journal is not balanced.");
  return entry;
}

export function postJournal(entry: JournalEntry): JournalEntry {
  if (entry.status !== "DRAFT") throw new Error("Only draft journals can be posted.");
  if (!validateDoubleEntry(entry)) throw new Error("Cannot post an unbalanced journal.");
  return { ...entry, status: "POSTED" };
}
