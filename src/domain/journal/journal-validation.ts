import type { JournalEntry } from "./journal-entry";
import {totalCredits,totalDebits} from "./journal-entry";
export function validateDoubleEntry(e:JournalEntry){
 const d=totalDebits(e); const c=totalCredits(e);
 return d.currency===c.currency && d.minorUnits===c.minorUnits && d.minorUnits>BigInt(0);
}
