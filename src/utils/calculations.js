// ✅ Total sales amount (uses totalPrice from SalesJournal)
export const getTotalSales = (sales) => {
    return sales.reduce(
      (sum, s) => sum + (Number(s.totalPrice) || 0),
      0
    );
  };
export const groupByProduct = (sales) => {
    const map = {};
  
    sales.forEach((s) => {
      if (!s.product) return;
  
      map[s.product] =
        (map[s.product] || 0) + (Number(s.quantity) || 0);
    });
  
    return map;
  };
export const groupByCategory = (sales) => {
    const map = {};
  
    sales.forEach((s) => {
      if (!s.category) return;
  
      map[s.category] =
        (map[s.category] || 0) + (Number(s.totalPrice) || 0);
    });
  
    return map;
  };
  