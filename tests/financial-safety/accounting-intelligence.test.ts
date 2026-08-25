import assert from "node:assert/strict";
import test from "node:test";
import { explainFinancialStatement } from "../../src/domain/accounting/accounting-intelligence";

test("accounting intelligence explains statements",()=>{
 const result=explainFinancialStatement({
  name:"Trial Balance",
  generatedAt:new Date(),
  total:{currency:"IRR",minorUnits:BigInt("1000")}
 });
 assert.equal(result.includes("Trial Balance"),true);
});
