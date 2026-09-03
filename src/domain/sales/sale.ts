export type SalesDraftLine={itemId:string;quantityMinorUnits:bigint;unitPrice:bigint;discount?:bigint;tax?:bigint};
export function calculateSalesLine(line:SalesDraftLine){
 if(!line.itemId.trim())throw new Error("SALE_ITEM_REQUIRED");
 if(line.quantityMinorUnits<=0n)throw new Error("SALE_QUANTITY_MUST_BE_POSITIVE");
 if(line.unitPrice<0n)throw new Error("SALE_UNIT_PRICE_INVALID");
 const gross=line.quantityMinorUnits*line.unitPrice,discount=line.discount??0n,tax=line.tax??0n;
 if(discount<0n||tax<0n||discount>gross)throw new Error("SALE_ADJUSTMENT_INVALID");
 const lineTotal=gross-discount+tax;if(lineTotal<=0n)throw new Error("SALE_LINE_TOTAL_INVALID");
 return{gross,discount,tax,lineTotal};
}
export function calculateSalesTotals(lines:SalesDraftLine[]){
 if(!lines.length)throw new Error("SALE_LINES_REQUIRED");
 return lines.reduce((t,l)=>{const x=calculateSalesLine(l);return{subtotal:t.subtotal+x.gross,discount:t.discount+x.discount,tax:t.tax+x.tax,total:t.total+x.lineTotal};},{subtotal:0n,discount:0n,tax:0n,total:0n});
}
export function assertSalesTransition(from:string,to:string){
 const a:Record<string,string[]>={DRAFT:["SUBMITTED","CANCELLED"],SUBMITTED:["APPROVED","CANCELLED"],APPROVED:["POSTED","CANCELLED"],POSTED:["PAID"],PAID:[],CANCELLED:[]};
 if(!a[from]?.includes(to))throw new Error(`INVALID_SALES_TRANSITION:${from}:${to}`);
}
