export interface Customer {
  id: string;
  workspaceId: string;
  code: string;
  name: string;
  mobile?: string;
  email?: string;
  active: boolean;
  createdAt: Date;
}

export function createCustomer(input: Omit<Customer, "active" | "createdAt"> & { createdAt?: Date }): Customer {
  if (!input.id.trim()) throw new Error("Customer id is required.");
  if (!input.workspaceId.trim()) throw new Error("Workspace id is required.");
  if (!input.code.trim()) throw new Error("Customer code is required.");
  if (!input.name.trim()) throw new Error("Customer name is required.");

  return {
    ...input,
    code: input.code.trim(),
    name: input.name.trim(),
    active: true,
    createdAt: input.createdAt ?? new Date(),
  };
}
