export interface BaseBudget {
  budgetId: string | undefined;
  userId: string;
  needPercentage: number;
  wantPercentage: number;
  savePercentage: number;
  baseAllocations: BaseAllocation[];
}

export interface MonthlyBudget extends BaseBudget {
  monthYear: string; // e.g., '06-2023'
  allocations: Allocation[];
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
    isStatic: boolean;  
  }
  
  export interface Allocation extends BaseAllocation {

  }
  