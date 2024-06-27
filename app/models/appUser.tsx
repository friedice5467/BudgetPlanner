export interface AppUser {
    uid : string;
    email : string | null;
    displayName : string | null;
    netMonthlyIncome: number;
    budgetId: string;
    startDate: string;
}
