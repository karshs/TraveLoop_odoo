import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBudget, addBudgetItem, deleteBudgetItem, autoGenerateBudget } from "../api/budget.api";
import { Trash2, AlertCircle, Loader2 } from "lucide-react";
import styles from "../styles/BudgetPage.module.scss";

export default function BudgetPage() {
  const { tripId } = useParams();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoGenLoading, setAutoGenLoading] = useState(false);
  const [newItem, setNewItem] = useState({ label: "", category: "MISC", amount: "", is_actual: false });

  const fetchBudget = async () => {
    try {
      const data = await getBudget(tripId!);
      setBudget(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudget();
  }, [tripId]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.label || !newItem.amount) return;
    try {
      await addBudgetItem(tripId!, { ...newItem, amount: Number(newItem.amount) });
      setNewItem({ label: "", category: "MISC", amount: "", is_actual: false });
      fetchBudget();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteBudgetItem(tripId!, itemId);
      fetchBudget();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAutoGenerate = async () => {
    setAutoGenLoading(true);
    try {
      await autoGenerateBudget(tripId!);
      fetchBudget();
    } catch (err) {
      console.error(err);
    } finally {
      setAutoGenLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading budget...</div>;
  if (!budget) return <div className={styles.error}>Could not load budget.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Trip Budget</h1>
        <button onClick={handleAutoGenerate} disabled={autoGenLoading} className={styles.autoGenBtn}>
          {autoGenLoading ? <Loader2 className={styles.spinner} /> : "Auto-Generate"}
        </button>
      </header>

      {budget.summary.over_budget && (
        <div className={styles.overBudgetBanner}>
          <AlertCircle size={20} />
          <span>You are over budget!</span>
        </div>
      )}

      <div className={styles.summaryCard}>
        <div className={styles.totalSpent}>
          <span>Total Spent</span>
          <h2>${budget.summary.total_spent.toFixed(2)}</h2>
        </div>
        <div className={styles.statChips}>
          <div className={styles.chip}>Limit: ${budget.summary.budget_limit || "N/A"}</div>
          <div className={styles.chip}>Remaining: ${budget.summary.remaining !== null ? budget.summary.remaining.toFixed(2) : "N/A"}</div>
          <div className={styles.chip}>Avg/Day: ${budget.summary.average_per_day.toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.breakdownGrid}>
        {Object.entries(budget.breakdown).map(([cat, amount]: any) => (
          <div key={cat} className={styles.breakdownCard}>
            <div className={`${styles.catIcon} ${styles[cat]}`} />
            <span>{cat}</span>
            <h4>${Number(amount).toFixed(2)}</h4>
          </div>
        ))}
      </div>

      <div className={styles.contentRow}>
        <div className={styles.itemsList}>
          <h3>Expenses</h3>
          {budget.items.map((item: any) => (
            <div key={item.id} className={styles.itemRow}>
              <div className={styles.itemInfo}>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={`${styles.badge} ${styles[item.category]}`}>{item.category}</span>
                {item.is_actual ? <span className={styles.actualTag}>Actual</span> : <span className={styles.estTag}>Est.</span>}
              </div>
              <div className={styles.itemActions}>
                <span className={styles.itemAmount}>${item.amount.toFixed(2)}</span>
                <button onClick={() => handleDeleteItem(item.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {budget.items.length === 0 && <p className={styles.empty}>No expenses yet.</p>}
        </div>

        <div className={styles.addForm}>
          <h3>Add Expense</h3>
          <form onSubmit={handleAddItem}>
            <input
              type="text"
              placeholder="Expense label"
              value={newItem.label}
              onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
              required
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
            >
              <option value="TRANSPORT">Transport</option>
              <option value="ACCOMMODATION">Accommodation</option>
              <option value="FOOD">Food</option>
              <option value="ACTIVITIES">Activities</option>
              <option value="SHOPPING">Shopping</option>
              <option value="MISC">Misc</option>
            </select>
            <input
              type="number"
              placeholder="Amount"
              value={newItem.amount}
              onChange={(e) => setNewItem({ ...newItem, amount: e.target.value })}
              required
            />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={newItem.is_actual}
                onChange={(e) => setNewItem({ ...newItem, is_actual: e.target.checked })}
              />
              Is Actual Expense?
            </label>
            <button type="submit" className={styles.submitBtn}>Add Expense</button>
          </form>
        </div>
      </div>
    </div>
  );
}
