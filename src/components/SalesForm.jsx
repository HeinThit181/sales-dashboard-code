import products from "../data/product-item.json";
import { useState } from "react";

export default function SalesForm() {
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [date, setDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const saveSale = () => {
    const product = products.find(p => p.id === productId);
    const category = newCategory || product.category;
    const total = product.price * qty;

    const sale = {
      id: Date.now(),
      productId,
      productName: product.name,
      category,
      quantity: qty,
      price: product.price,
      total,
      date
    };

    const existing = JSON.parse(localStorage.getItem("sales")) || [];
    localStorage.setItem("sales", JSON.stringify([...existing, sale]));
    window.location.reload();
  };

  return (
    <div className="card">
      <select onChange={e => setProductId(e.target.value)}>
        <option>Select Product</option>
        {products.map(p => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input type="number" min="1" value={qty} onChange={e => setQty(+e.target.value)} />
      <input type="date" onChange={e => setDate(e.target.value)} />
      <input placeholder="New Category (optional)" onChange={e => setNewCategory(e.target.value)} />

      <button onClick={saveSale}>Save</button>
    </div>
  );
}
