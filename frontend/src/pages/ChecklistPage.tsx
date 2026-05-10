import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChecklist, addChecklistItem, updateChecklistItem, deleteChecklistItem, resetChecklist } from "../api/checklist.api";
import { Trash2, RotateCcw } from "lucide-react";
import styles from "../styles/ChecklistPage.module.scss";

export default function ChecklistPage() {
  const { tripId } = useParams();
  const [itemsGrouped, setItemsGrouped] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("MISC");

  const fetchChecklist = async () => {
    try {
      const res = await getChecklist(tripId!);
      setItemsGrouped(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklist();
  }, [tripId]);

  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    // Optimistic update
    setItemsGrouped((prev: any) => {
      const next = { ...prev };
      for (const cat in next) {
        next[cat] = next[cat].map((i: any) => i.id === itemId ? { ...i, is_packed: !currentStatus } : i);
      }
      return next;
    });

    try {
      await updateChecklistItem(tripId!, itemId, { is_packed: !currentStatus });
    } catch (err) {
      console.error(err);
      fetchChecklist(); // revert on fail
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      await deleteChecklistItem(tripId!, itemId);
      fetchChecklist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemLabel) return;
    try {
      await addChecklistItem(tripId!, { label: newItemLabel, category: newItemCategory });
      setNewItemLabel("");
      fetchChecklist();
    } catch (err) {
      console.error(err);
    }
  };

  const handleReset = async () => {
    if (!window.confirm("Are you sure you want to uncheck all items?")) return;
    try {
      await resetChecklist(tripId!);
      fetchChecklist();
    } catch (err) {
      console.error(err);
    }
  };

  const allItems = Object.values(itemsGrouped).flat() as any[];
  const total = allItems.length;
  const packed = allItems.filter(i => i.is_packed).length;
  const progressPercent = total === 0 ? 0 : (packed / total) * 100;

  if (loading) return <div className={styles.loading}>Loading checklist...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Packing Checklist</h1>
        <button onClick={handleReset} className={styles.resetBtn}>
          <RotateCcw size={16} /> Reset All
        </button>
      </header>

      <div className={styles.progressContainer}>
        <div className={styles.progressText}>{packed} / {total} packed</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <div className={styles.listContainer}>
        {Object.entries(itemsGrouped).map(([category, items]: any) => (
          <div key={category} className={styles.categoryGroup}>
            <h3 className={styles.categoryHeader}>{category}</h3>
            {items.map((item: any) => (
              <div key={item.id} className={`${styles.itemRow} ${item.is_packed ? styles.packed : ""}`}>
                <label className={styles.checkboxContainer}>
                  <input
                    type="checkbox"
                    checked={item.is_packed}
                    onChange={() => handleToggle(item.id, item.is_packed)}
                  />
                  <span className={styles.checkmark}></span>
                </label>
                <span className={styles.itemLabel}>{item.label}</span>
                <span className={`${styles.badge} ${styles[item.category]}`}>{item.category}</span>
                <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}
        {total === 0 && <p className={styles.empty}>Your checklist is empty.</p>}
      </div>

      <div className={styles.addForm}>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Item to pack..."
            value={newItemLabel}
            onChange={(e) => setNewItemLabel(e.target.value)}
            required
          />
          <select value={newItemCategory} onChange={(e) => setNewItemCategory(e.target.value)}>
            <option value="CLOTHING">Clothing</option>
            <option value="DOCUMENTS">Documents</option>
            <option value="ELECTRONICS">Electronics</option>
            <option value="TOILETRIES">Toiletries</option>
            <option value="MEDICINES">Medicines</option>
            <option value="ACCESSORIES">Accessories</option>
            <option value="MISC">Misc</option>
          </select>
          <button type="submit" className={styles.addBtn}>Add Item</button>
        </form>
      </div>
    </div>
  );
}
