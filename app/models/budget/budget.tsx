export interface BaseBudget {
  budgetId: string | undefined;
  userId: string;
  needPercentage: number;
  wantPercentage: number;
  savePercentage: number;
}

export interface MonthlyBudget extends BaseBudget {
  monthYear: string; // e.g., '2023-06'
  allocations: Allocation[];
}

export interface Allocation {
  allocationId: string;
  type: 'need' | 'want' | 'save';
  description: string;
  amount: number;
}
