const LoadingSkeleton = ({ count = 7 }) => (
  <div className="space-y-3 lg:space-y-4">
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="animate-pulse flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 rounded-lg lg:rounded-xl border border-slate-200 bg-slate-100 p-3 lg:p-4 shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-slate-300 flex-shrink-0" />
          <div className="h-3 lg:h-4 w-full sm:w-36 lg:w-48 rounded bg-slate-300" />
        </div>
        <div className="flex items-center gap-2 sm:gap-2 lg:gap-3 flex-shrink-0">
          <div className="h-6 lg:h-8 w-full sm:w-20 lg:w-24 rounded bg-slate-300" />
          <div className="hidden sm:block h-6 lg:h-8 w-6 lg:w-8 rounded bg-slate-300" />
          <div className="hidden sm:block h-6 lg:h-8 w-6 lg:w-8 rounded bg-slate-300" />
        </div>
      </div>
    ))}
  </div>
);

export default LoadingSkeleton;
