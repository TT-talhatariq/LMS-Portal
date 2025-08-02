const LoadingSkeleton = ({ count = 7 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex items-center justify-between rounded-xl border border-slate-200 bg-slate-100 px-4 py-4 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-slate-300" />
          <div className="h-4 w-36 rounded bg-slate-300" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 rounded bg-slate-300" />
          <div className="h-8 w-8 rounded bg-slate-300" />
          <div className="h-8 w-8 rounded bg-slate-300" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;