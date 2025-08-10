import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
const SidebarToggle = ({ isOpen, toggleSidebar }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleSidebar}
            className={cn(
              'fixed top-1/2 right-0 z-50 -translate-y-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-2 rounded-l-full shadow-lg transition-all hover:from-emerald-600 hover:to-teal-600',
              'focus:outline-none focus:ring-2 focus:ring-emerald-300',
            )}
          >
            <div
              className={cn(
                'transform transition-transform duration-300',
                isOpen ? 'rotate-180' : 'rotate-0',
              )}
            >
              {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-slate-800 text-white text-xs">
          Course Outline
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SidebarToggle;
