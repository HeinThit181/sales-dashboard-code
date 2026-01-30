import { Line, Bar, Pie } from "react-chartjs-2";
import "chart.js/auto";
import { groupByCategory } from "../utils/calculations";

export default function Charts({ sales, type, period, dataType }) {
  if (!sales || sales.length === 0) {
    return <p>No sales data available.</p>;
  }

  if (type === "line") {
    const map = {};

    sales.forEach((s) => {
      if (!s.date || !s.totalPrice) return;

      const d = new Date(s.date);
      let key = "";

      if (period === "daily") {
        key = d.toLocaleDateString("en-US", { weekday: "short" });
      }

      if (period === "weekly") {
        const week = Math.ceil(d.getDate() / 7);
        key = `Week ${week}`;
      }

      if (period === "monthly") {
        key = d.toLocaleDateString("en-US", { month: "short" });
      }

      map[key] = (map[key] || 0) + Number(s.totalPrice);
    });

    const labels = Object.keys(map);
    const values = Object.values(map);

    if (labels.length === 0) {
      return <p>No sales data available.</p>;
    }

    return (
      <div style={{ height: "320px" }}>
        <Line
          data={{
            labels,
            datasets: [
              {
                label: "Sales Trend",
                data: values,
                borderWidth: 2,
                tension: 0.4,
                fill: false,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    );
  }

  let labels = [];
  let values = [];

  if (dataType === "category") {
    labels = sales.map(([name]) => name);
    values = sales.map(([, value]) => value);
  } else {
    const byCategory = groupByCategory(sales);
    labels = Object.keys(byCategory);
    values = Object.values(byCategory);
  }

  if (labels.length === 0) {
    return <p>No sales data available.</p>;
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: "Sales by Category",
        data: values,
        radius: type === "pie" ? "75%" : undefined,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div
      style={{
        height: "500px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {type === "pie" ? (
        <Pie data={chartData} options={chartOptions} />
      ) : (
        <Bar data={chartData} options={chartOptions} />
      )}
    </div>
  );
}
