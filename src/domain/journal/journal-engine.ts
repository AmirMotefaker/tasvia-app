import type { JournalEntry } from "./journal-entry";
export function postJournalEntry(entry:JournalEntry):JournalEntry{
 if(!validate(entry)) throw new Error("Unbalanced double entry journal.");
 return {...entry,status:"POSTED"};
}
import {validateDoubleEntry as validate} from "./journal-validation";
