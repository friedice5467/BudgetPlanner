export interface BaseBudget {
  budgetId: string;
  userId: string;
  netMonthlyIncome: number;
  needPercentage: number;
  wantPercentage: number;
  savePercentage: number;
  baseAllocations: BaseAllocation[];
}

export interface MonthlyBudget extends Omit<BaseBudget, 'baseAllocations'> {
  monthYear: string;  // Format: 'mm-YYYY'
  allocations: Allocation[];  // Monthly specific allocations
  excessMoney : ExcessMoney;
}

export interface ExcessMoney {
  need: number;
  want: number;
  save: number;
}

export enum BudgetType {
  NEED = 'need',
  WANT = 'want',
  SAVE = 'save',
}

export interface BaseAllocation {
  allocationId: string;
  type: BudgetType;
  description: string;
  amount: number;
  isStatic: boolean; // Indicates if this allocation should be copied automatically to new monthly budgets
}

export interface Allocation extends BaseAllocation {
}
