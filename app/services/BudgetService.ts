import firestore from '../../shims/firebase-firestore-web';
import { Transaction } from '@firebase/firestore-types';
import { BaseBudget, MonthlyBudget, Allocation, BaseAllocation, ExcessMoney } from '../models/budget/budget';

class BudgetService {
  private budgetsCollection = firestore().collection('budgets');

  async createBaseBudget(budget: Omit<BaseBudget, 'budgetId'>): Promise<string> {
    if (!this.validatePercentages(budget.needPercentage, budget.wantPercentage, budget.savePercentage)) {
      throw new Error('Invalid budget percentages');
    }

    const budgetId = this.budgetsCollection.doc().id;
    const baseBudget: BaseBudget = {
      ...budget,
      budgetId
    };

    await this.budgetsCollection.doc(budgetId).set(baseBudget);
    return budgetId;
  }

  async getBaseBudget(budgetId: string): Promise<BaseBudget> {
    const budgetDoc = await this.budgetsCollection.doc(budgetId).get();
    if (!budgetDoc.exists) {
      throw new Error('Base budget not found');
    }
    return budgetDoc.data() as BaseBudget;
  }

  async createMonthlyBudget(budgetId: string, monthYear: string): Promise<MonthlyBudget> {
    const baseBudgetDoc = await this.budgetsCollection.doc(budgetId).get();
    if (!baseBudgetDoc.exists) {
      throw new Error('Base budget not found');
    }

    const baseBudget = baseBudgetDoc.data() as BaseBudget;

    const netIncome = baseBudget.netMonthlyIncome;

    const totals = baseBudget.baseAllocations.reduce((acc, alloc) => {
      acc[alloc.type] += alloc.amount;
      return acc;
    }, { need: 0, want: 0, save: 0 });

    const excessMoney = {
      need: (netIncome * baseBudget.needPercentage / 100) - totals.need,
      want: (netIncome * baseBudget.wantPercentage / 100) - totals.want,
      save: (netIncome * baseBudget.savePercentage / 100) - totals.save,
    };

    const monthlyBudget: MonthlyBudget = {
      ...baseBudget,
      monthYear,
      allocations: baseBudget.baseAllocations,
      excessMoney: excessMoney
    };
    await this.budgetsCollection
      .doc(budgetId)
      .collection('monthlyBudgets')
      .doc(monthYear)
      .set(monthlyBudget);

    return monthlyBudget;
  }

  async getMonthlyBudget(budgetId: string, monthYear: string): Promise<MonthlyBudget> {
    const monthlyBudgetDoc = await this.budgetsCollection
      .doc(budgetId)
      .collection('monthlyBudgets')
      .doc(monthYear)
      .get();

    if (!monthlyBudgetDoc.exists) {
      return await this.createMonthlyBudget(budgetId, monthYear);
    }
    return monthlyBudgetDoc.data() as MonthlyBudget;
  }

  async modifyMonthlyBudget(budgetId: string, monthYear: string, modification: Partial<MonthlyBudget> & { newAllocation?: Allocation, updatedAllocation?: Allocation, newBaseAllocation?: BaseAllocation, updatedBaseAllocation?: BaseAllocation, deleteAllocation?: Allocation }) {
    await this.executeInTransaction(async (transaction) => {
      const monthlyBudgetRef = this.budgetsCollection
        .doc(budgetId)
        .collection('monthlyBudgets')
        .doc(monthYear);

      const doc = await transaction.get(monthlyBudgetRef);
      if (!doc.exists) {
        throw new Error('Monthly budget not found');
      }

      const monthlyBudget = doc.data() as MonthlyBudget;

      if (modification.newAllocation) {
        monthlyBudget.allocations.push(modification.newAllocation);
      }

      if (modification.updatedAllocation) {
        const index = monthlyBudget.allocations.findIndex(a => a.allocationId === modification.updatedAllocation!.allocationId);
        if (index === -1) {
          throw new Error('Allocation not found');
        }
        monthlyBudget.allocations[index] = modification.updatedAllocation;
      }

      if (modification.newBaseAllocation) {
        this.addBaseAllocation(budgetId, modification.newBaseAllocation, transaction);
      }

      if (modification.updatedBaseAllocation) {
        this.updateBaseAllocation(budgetId, modification.updatedBaseAllocation, monthYear, transaction);
      }

      if (modification.deleteAllocation) {
        monthlyBudget.allocations = monthlyBudget.allocations.filter(a => a.allocationId !== modification.deleteAllocation!.allocationId);
      }

      const netIncome = monthlyBudget.netMonthlyIncome;
      const totals = monthlyBudget.allocations.reduce((acc, alloc) => {
        acc[alloc.type] += alloc.amount;
        return acc;
      }, { need: 0, want: 0, save: 0 });

      monthlyBudget.excessMoney = {
        need: (netIncome * monthlyBudget.needPercentage / 100) - totals.need,
        want: (netIncome * monthlyBudget.wantPercentage / 100) - totals.want,
        save: (netIncome * monthlyBudget.savePercentage / 100) - totals.save,
      };

      transaction.update(monthlyBudgetRef, monthlyBudget);
    });
  }

  private async addBaseAllocation(userId: string, newBaseAllocation: BaseAllocation, transaction: Transaction) {
    const baseBudgetRef = this.budgetsCollection.doc(userId);
    const baseBudgetDoc = await transaction.get(baseBudgetRef);
    if (!baseBudgetDoc.exists) {
      throw new Error('Base budget not found');
    }

    const baseBudget = baseBudgetDoc.data() as BaseBudget;
    baseBudget.baseAllocations.push(newBaseAllocation);
    transaction.update(baseBudgetRef, { baseAllocations: baseBudget.baseAllocations });
  }

  private async updateBaseAllocation(userId: string, updatedBaseAllocation: BaseAllocation, currentMonthYear: string, transaction: Transaction) {
    const baseBudgetRef = this.budgetsCollection.doc(userId);
    const baseBudgetDoc = await transaction.get(baseBudgetRef);
    if (!baseBudgetDoc.exists) {
      throw new Error('Base budget not found');
    }

    const baseBudget = baseBudgetDoc.data() as BaseBudget;
    const allocationIndex = baseBudget.baseAllocations.findIndex(a => a.allocationId === updatedBaseAllocation.allocationId);
    if (allocationIndex === -1) {
      throw new Error('Base allocation not found');
    }

    baseBudget.baseAllocations[allocationIndex] = updatedBaseAllocation;
    transaction.update(baseBudgetRef, { baseAllocations: baseBudget.baseAllocations });

    //this.propagateBaseAllocationUpdates(userId, updatedBaseAllocation, currentMonthYear, transaction);
  }

  public async getMonthlyBudgetsAllTime(budgetId: string): Promise<MonthlyBudget[]> {
    const monthlyBudgets = await this.budgetsCollection
      .doc(budgetId)
      .collection('monthlyBudgets')
      .orderBy('monthYear', 'desc')
      .get();
  
    return monthlyBudgets.docs.map(doc => doc.data() as MonthlyBudget);
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
