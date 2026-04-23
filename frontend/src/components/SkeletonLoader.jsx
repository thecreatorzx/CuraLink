function SkeletonLoader() {
  return (
    <div className="p-5 space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-2.5 bg-slate-100 rounded-full w-full" />
        <div className="h-2.5 bg-slate-100 rounded-full w-5/6" />
        <div className="h-2.5 bg-slate-100 rounded-full w-4/6" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 border-l-2 border-slate-100 pl-3">
            <div className="space-y-1.5 flex-1">
              <div className="h-2.5 bg-slate-100 rounded-full w-full" />
              <div className="h-2.5 bg-slate-100 rounded-full w-3/4" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-7 w-28 bg-slate-100 rounded-full" />
        <div className="h-7 w-28 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
}

export default SkeletonLoader;