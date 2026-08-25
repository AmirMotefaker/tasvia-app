import assert from "node:assert/strict";
import test from "node:test";
import { calculateNetProfit } from "../../src/domain/statements/income-statement";
test("net profit uses exact money values",()=>{assert.equal(calculateNetProfit({currency:"IRR",minorUnits:BigInt('100000')},{currency:"IRR",minorUnits:BigInt('30000')}).minorUnits,BigInt('70000'));});
