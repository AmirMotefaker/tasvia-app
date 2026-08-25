import type { AccountType } from "./account-type";
export interface Account {
 id:string;
 code:string;
 name:string;
 type:AccountType;
 active:boolean;
}
