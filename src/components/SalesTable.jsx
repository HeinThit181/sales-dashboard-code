export default function SalesTable() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
  
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Product</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {sales.map(s => (
            <tr key={s.id}>
              <td>{s.date}</td>
              <td>{s.productName}</td>
              <td>{s.category}</td>
              <td>{s.quantity}</td>
              <td>{s.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  