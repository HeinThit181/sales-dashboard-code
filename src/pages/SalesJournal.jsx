import { useState, useEffect } from "react";
import products from "../data/product-item.json";
import "../components/salesJournal.css";

export default function SalesJournal() {
  const [sales, setSales] = useState(() => {
    return JSON.parse(localStorage.getItem("sales")) || [];
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const productObj = products.find(
    (p) => p.itemName === selectedProduct
  );

  const unitPrice = productObj?.unitPrice || 0;
  const category = newCategory || productObj?.category || "";
  const totalPrice = unitPrice * quantity;

  const addSale = () => {
    if (!selectedProduct) {
      alert("Please select a product");
      return;
    }

    if (!date) {
      alert("Please select a date");
      return;
    }

    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }

    const newSale = {
      product: selectedProduct,
      category,
      quantity,
      unitPrice,
      totalPrice,
      date,
    };

    setSales([...sales, newSale]);

    setSelectedProduct("");
    setQuantity(1);
    setDate("");
    setNewCategory("");
  };

  const deleteSale = (index) => {
    setSales(sales.filter((_, i) => i !== index));
  };

  return (
    <div className="journal-container">
      <h1>Sales Journal</h1>

      <div className="card">
        <h2>Add New Sale</h2>

        <div className="form-grid">
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((p, i) => (
              <option key={i} value={p.itemName}>
                {p.itemName} (฿{p.unitPrice})
              </option>
            ))}
          </select>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <input
            type="text"
            placeholder="New Category (Optional)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
        </div>

        <div className="total-row">
          <strong>Total Price: ฿ {totalPrice}</strong>
          <button onClick={addSale}>Add Sale</button>
        </div>
      </div>

      <div className="card">
        <h2>Sales Records</h2>

        {sales.length === 0 ? (
          <p>No sales recorded yet.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sales.map((sale, index) => (
                  <tr key={index}>
                    <td>{sale.date}</td>
                    <td>{sale.product}</td>
                    <td>{sale.category}</td>
                    <td>{sale.quantity}</td>
                    <td>฿ {sale.unitPrice}</td>
                    <td>฿ {sale.totalPrice}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSale(index)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
