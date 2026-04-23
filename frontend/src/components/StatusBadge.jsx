function StatusBadge({ status }) {
  const map = {
    Active:     "bg-emerald-50 text-emerald-700 border-emerald-200",
    Recruiting: "bg-blue-50 text-blue-700 border-blue-200",
    Completed:  "bg-slate-100 text-slate-500 border-slate-200",
    Terminated: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full border ${map[status] ?? map.Completed}`}>
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === "Recruiting" ? "bg-blue-500" :
        status === "Active"     ? "bg-emerald-500" :
        status === "Completed"  ? "bg-slate-400"  : "bg-red-500"
      }`} />
      {status}
    </span>
  );
}

export default StatusBadge;