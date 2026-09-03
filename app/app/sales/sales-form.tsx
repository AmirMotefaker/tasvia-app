"use client";
import {useActionState} from "react";import {createSaleAction,type SalesActionState} from "./actions";
const initial:SalesActionState={ok:false,message:""};
export function SalesForm({customers,warehouses,items}:{customers:{id:string;name:string}[];warehouses:{id:string;name:string;code:string}[];items:{id:string;name:string;sku:string|null}[]}){
 const[state,action,pending]=useActionState(createSaleAction,initial);const cls="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm";
 return <form action={action} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 sm:grid-cols-2 xl:grid-cols-4">
 <label className="text-xs font-black">شماره فاکتور<input name="invoiceNumber" required className={cls}/></label>
 <label className="text-xs font-black">مشتری<select name="customerId" required className={cls}><option value="">انتخاب</option>{customers.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
 <label className="text-xs font-black">انبار<select name="warehouseId" required className={cls}><option value="">انتخاب</option>{warehouses.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
 <label className="text-xs font-black">کالا/خدمت<select name="itemId" required className={cls}><option value="">انتخاب</option>{items.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
 <label className="text-xs font-black">تاریخ<input name="issuedAt" type="date" required className={cls}/></label><label className="text-xs font-black">سررسید<input name="dueAt" type="date" required className={cls}/></label>
 <label className="text-xs font-black">تعداد<input name="quantity" required inputMode="numeric" className={cls}/></label><label className="text-xs font-black">قیمت واحد<input name="unitPrice" required inputMode="numeric" className={cls}/></label>
 <label className="text-xs font-black">تخفیف<input name="discount" defaultValue="0" className={cls}/></label><label className="text-xs font-black">مالیات<input name="tax" defaultValue="0" className={cls}/></label>
 <div className="sm:col-span-2 xl:col-span-4">{state.message&&<div className="mb-3 rounded-xl bg-slate-50 p-3 text-xs font-black">{state.message}</div>}<button disabled={pending} className="w-full rounded-xl bg-[#102845] p-3 text-sm font-black text-white">{pending?"در حال ثبت…":"ثبت پیش‌نویس فروش"}</button></div></form>
}
