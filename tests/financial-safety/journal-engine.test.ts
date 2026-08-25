import assert from "node:assert/strict";
import test from "node:test";
import {irr} from "../../src/domain/financial-safety/money";
import {validateDoubleEntry} from "../../src/domain/journal/journal-validation";

test("balanced journals pass",()=>{
 const e = {id:"1",reference:"r",description:"d",status:"DRAFT" as const,createdAt:new Date(),lines:[
 {id:"1",journalEntryId:"1",accountId:"cash",direction:"DEBIT" as const,amount:irr(1000)},
 {id:"2",journalEntryId:"1",accountId:"payable",direction:"CREDIT" as const,amount:irr(1000)}
 ]};
 assert.equal(validateDoubleEntry(e),true);
});
