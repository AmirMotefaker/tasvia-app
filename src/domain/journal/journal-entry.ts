import type { JournalLine } from "./journal-line";
import type { JournalStatus } from "./journal-status";
import type { Money } from "../financial-safety/money";

export interface JournalEntry {
 id:string;
 reference:string;
 description:string;
 status:JournalStatus;
 lines:JournalLine[];
 createdAt:Date;
}

function sum(entry:JournalEntry,direction:"DEBIT"|"CREDIT"):Money{
 return entry.lines.filter(x=>x.direction===direction).map(x=>x.amount).reduce(
 (a,b)=>({currency:a.currency,minorUnits:a.minorUnits+b.minorUnits}),
 {currency:"IRR",minorUnits:BigInt(0)});
}

export function totalDebits(e:JournalEntry){return sum(e,"DEBIT")}
export function totalCredits(e:JournalEntry){return sum(e,"CREDIT")}
