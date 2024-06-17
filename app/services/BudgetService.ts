import firestore from '../../shims/firebase-firestore-web';
import { Transaction } from '@firebase/firestore-types';
import { BaseBudget, MonthlyBudget, Allocation } from '../models/budget/budget';

class BudgetService {
  private budgetsCollection = firestore().collection('budgets');

  async createBaseBudget(budget: Omit<BaseBudget, "budgetId">) : Promise<string> {
    if (!this.validatePercentages(budget.needPercentage, budget.wantPercentage, budget.savePercentage)) {
      throw new Error('Invalid budget percentages');
    }

    const budgetRef = this.budgetsCollection.doc();

    const baseBudget: BaseBudget = {
      budgetId: budgetRef.id,
      userId: budget.userId,
      needPercentage: budget.needPercentage,
      wantPercentage: budget.wantPercentage,
      savePercentage: budget.savePercentage,
    };

    await this.budgetsCollection.doc(baseBudget.budgetId).set(baseBudget);
    return baseBudget.budgetId as string;
  }

  async getBaseBudget(budgetId: string): Promise<BaseBudget> {
    const budgetDoc = await this.budgetsCollection.doc(budgetId).get();
    if (!budgetDoc.exists) {
      throw new Error('Base budget not found');
    }
    return budgetDoc.data() as BaseBudget;
  }

  async createMonthlyBudget(userId: string, monthYear: string) {
    const budgetDoc = await this.budgetsCollection.doc(userId).get();
    if (!budgetDoc.exists) {
      throw new Error('Base budget not found');
    }

    const baseBudget = budgetDoc.data() as BaseBudget;
    const monthlyBudget: MonthlyBudget = {
      ...baseBudget,
      monthYear,
      allocations: []
    };

    await this.budgetsCollection
      .doc(userId)
      .collection('monthlyBudgets')
      .doc(monthYear)
      .set(monthlyBudget);
  }

  async getMonthlyBudget(userId: string, monthYear: string): Promise<MonthlyBudget> {
    const monthlyBudgetDoc = await this.budgetsCollection
      .doc(userId)
      .collection('monthlyBudgets')
      .doc(monthYear)
      .get();

    if (!monthlyBudgetDoc.exists) {
      throw new Error('Monthly budget not found');
    }
    return monthlyBudgetDoc.data() as MonthlyBudget;
  }

  async addAllocation(userId: string, monthYear: string, allocation: Allocation) {
    await this.executeInTransaction(async (transaction) => {
      const monthlyBudgetRef = this.budgetsCollection
        .doc(userId)
        .collection('monthlyBudgets')
        .doc(monthYear);
        
      const monthlyBudgetDoc = await transaction.get(monthlyBudgetRef);
      if (!monthlyBudgetDoc.exists) {
        throw new Error('Monthly budget not found');
      }

      const monthlyBudget = monthlyBudgetDoc.data() as MonthlyBudget;
      monthlyBudget.allocations.push(allocation);
      transaction.update(monthlyBudgetRef, { allocations: monthlyBudget.allocations });
    });
  }

  async updateAllocation(userId: string, monthYear: string, allocationId: string, updatedAllocation: Allocation) {
    await this.executeInTransaction(async (transaction) => {
      const monthlyBudgetRef = this.budgetsCollection
        .doc(userId)
        .collection('monthlyBudgets')
        .doc(monthYear);

      const monthlyBudgetDoc = await transaction.get(monthlyBudgetRef);
      if (!monthlyBudgetDoc.exists) {
        throw new Error('Monthly budget not found');
      }

      const monthlyBudget = monthlyBudgetDoc.data() as MonthlyBudget;
      const allocationIndex = monthlyBudget.allocations.findIndex(a => a.allocationId === allocationId);
      if (allocationIndex === -1) {
        throw new Error('Allocation not found');
      }

      monthlyBudget.allocations[allocationIndex] = updatedAllocation;
      transaction.update(monthlyBudgetRef, { allocations: monthlyBudget.allocations });
    });
  }

  async deleteAllocation(userId: string, monthYear: string, allocationId: string) {
    await this.executeInTransaction(async (transaction) => {
      const monthlyBudgetRef = this.budgetsCollection
        .doc(userId)
        .collection('monthlyBudgets')
        .doc(monthYear);

      const monthlyBudgetDoc = await transaction.get(monthlyBudgetRef);
      if (!monthlyBudgetDoc.exists) {
        throw new Error('Monthly budget not found');
      }

      const monthlyBudget = monthlyBudgetDoc.data() as MonthlyBudget;
      monthlyBudget.allocations = monthlyBudget.allocations.filter(a => a.allocationId !== allocationId);
      transaction.update(monthlyBudgetRef, { allocations: monthlyBudget.allocations });
    });
  }

  private async executeInTransaction(callback: (transaction: Transaction) => Promise<void>) {
    await firestore().runTransaction(async (transaction) => {
      await callback(transaction);
    });
  }

  private validatePercentages(need: number, want: number, save: number): boolean {
    const total = need + want + save;
    return total === 100 && need >= 0 && want >= 0 && save >= 0;
  }
}

export default new BudgetService();
