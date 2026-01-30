import { useState, useMemo } from "react";
import Charts from "../components/Charts";
import { getTotalSales } from "../utils/calculations";
import "../components/dashboard.css";

export default function Dashboard() {
  const sales = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("sales")) || [];
    } catch {
      return [];
    }
  }, []);

  const [period, setPeriod] = useState("daily");
  const [categoryChartType, setCategoryChartType] = useState("bar");

  const filteredSales = useMemo(() => {
    const now = new Date();

    return sales.filter((s) => {
      if (!s.date) return false;

      const saleDate = new Date(s.date);

      if (period === "daily") {
        const diffDays = (now - saleDate) / (1000 * 60 * 60 * 24);
        return diffDays <= 7;
      }

      if (period === "weekly") {
        return (
          saleDate.getMonth() === now.getMonth() &&
          saleDate.getFullYear() === now.getFullYear()
        );
      }

      if (period === "monthly") {
        return saleDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  }, [sales, period]);

  const { topProducts, bestSeller } = useMemo(() => {
    const productMap = {};

    filteredSales.forEach(({ product, quantity }) => {
      if (!product || !quantity) return;
      productMap[product] = (productMap[product] || 0) + quantity;
    });

    const sorted = Object.entries(productMap).sort((a, b) => b[1] - a[1]);

    return {
      topProducts: sorted.slice(0, 5),
      bestSeller: sorted.length ? sorted[0][0] : "—",
    };
  }, [filteredSales]);

  const categoryData = useMemo(() => {
    const map = {};

    filteredSales.forEach(({ category, quantity }) => {
      if (!category || !quantity) return;
      map[category] = (map[category] || 0) + quantity;
    });

    return Object.entries(map);
  }, [filteredSales]);

  const productSalesData = useMemo(() => {
    const map = {};

    filteredSales.forEach(({ product, quantity, totalPrice }) => {
      if (!product || !quantity || !totalPrice) return;

      if (!map[product]) {
        map[product] = { units: 0, amount: 0 };
      }

      map[product].units += quantity;
      map[product].amount += Number(totalPrice);
    });

    return Object.entries(map);
  }, [filteredSales]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="period-buttons">
        {["daily", "weekly", "monthly"].map((p) => (
          <button
            key={p}
            className={period === p ? "active" : ""}
            onClick={() => setPeriod(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className="card">
          <h3>Total Sales</h3>
          <p className="total-amount">฿ {getTotalSales(filteredSales)}</p>
        </div>

        <div className="card">
          <h3>Total Transactions</h3>
          <p className="total-amount">{filteredSales.length}</p>
        </div>

        <div className="card">
          <h3>Best Selling Product</h3>
          <p className="total-amount">{bestSeller}</p>
        </div>
      </div>

      <div className="grid">
        <div className="card">
          <h3>Sales Trend</h3>
          <div className="chart-wrapper">
            <Charts sales={filteredSales} type="line" period={period} />
          </div>
        </div>

        <div className="card">
          <h3>Top 5 Selling Products</h3>

          {topProducts.length === 0 ? (
            <p>No sales data available.</p>
          ) : (
            <div className="top-products">
              {topProducts.map(([name, qty], index) => (
                <div key={name} className="top-product-row">
                  <div className="rank">{index + 1}</div>
                  <div className="product-info">
                    <span className="product-name">{name}</span>
                    <span className="product-units">{qty} units</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3>Sales by Category</h3>

          <div className="period-buttons">
            {["bar", "pie"].map((t) => (
              <button
                key={t}
                className={categoryChartType === t ? "active" : ""}
                onClick={() => setCategoryChartType(t)}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {categoryData.length === 0 ? (
            <p>No category data available.</p>
          ) : (
            <div className="chart-wrapper">
              <Charts
                sales={categoryData}
                type={categoryChartType}
                dataType="category"
              />
            </div>
          )}
        </div>

        <div className="card product-sales">
          <h3>Sales by Product</h3>

          {productSalesData.length === 0 ? (
            <p>No product data available.</p>
          ) : (
            <div className="table-scroll">
              <table className="sales-table">
                <thead>
                  <tr>
                    <th align="left">Product</th>
                    <th align="right">Units</th>
                    <th align="right">Revenue (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {productSalesData.map(([name, data]) => (
                    <tr key={name} className="sales-row">
                      <td className="product-cell">{name}</td>
                      <td align="right" className="units-cell">
                        {data.units}
                      </td>
                      <td align="right" className="amount-cell">
                        ฿ {data.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
