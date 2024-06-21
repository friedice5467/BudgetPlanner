export interface BaseBudget {
  budgetId: string | undefined;
  userId: string;
  needPercentage: number;
  wantPercentage: number;
  savePercentage: number;
  baseAllocations: BaseAllocation[];
}

export interface MonthlyBudget extends BaseBudget {
  monthYear: string; // e.g., '2023-06'
  allocations: Allocation[];
}

export interface BaseAllocation {
    allocationId: string;
    type: 'need' | 'want' | 'save';
    description: string;
    amount: number;
    isStatic: boolean;  
  }
  
  export interface Allocation extends BaseAllocation {

  }
  