interface Props {
  analytics: {
    total: number;
    completed: number;
    incomplete: number;
    overdue: number;
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
  };
}

export default function AnalyticsView({ analytics }: Props) {
  return (
    <div className="view-container">
      <h2 className="view-title">📊 Phân tích năng suất</h2>
      <ul className="analytics-list">
        <li>Tổng task: {analytics.total}</li>
        <li>Đã hoàn thành: {analytics.completed}</li>
        <li>Chưa hoàn thành: {analytics.incomplete}</li>
        <li>Quá hạn: {analytics.overdue}</li>
      </ul>

      <h3 className="sub-title">Theo độ ưu tiên:</h3>
      <ul className="analytics-list">
        <li>🔥 Cao: {analytics.byPriority.high}</li>
        <li>⚡ Trung bình: {analytics.byPriority.medium}</li>
        <li>🌱 Thấp: {analytics.byPriority.low}</li>
      </ul>
    </div>
  );
}
