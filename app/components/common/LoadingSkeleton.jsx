const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-12 bg-slate-200 rounded-lg"></div>
        </div>
      ))}
    </div>
);
  
export default LoadingSkeleton;