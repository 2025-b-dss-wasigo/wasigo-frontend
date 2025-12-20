import React from 'react';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <Loader2 className={cn("animate-spin text-primary", sizeClasses[size])} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
}

interface ListLoaderProps {
  count?: number;
}

export function ListLoader({ count = 3 }: ListLoaderProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="w-12 h-12 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface PaginationLoaderProps {
  className?: string;
}

export function PaginationLoader({ className }: PaginationLoaderProps) {
  return (
    <div className={cn("flex justify-center py-4", className)}>
      <LoadingSpinner size="sm" text="Cargando más..." />
    </div>
  );
}

interface ListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
  className?: string;
}

export function ListPagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  className
}: ListPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(page =>
    page === 1 ||
    page === totalPages ||
    (page >= currentPage - 1 && page <= currentPage + 1)
  );

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 pt-4", className)}>
      {totalItems && itemsPerPage && (
        <p className="text-sm text-muted-foreground">
          Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
        </p>
      )}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1];
          const showEllipsis = prevPage && page - prevPage > 1;

          return (
            <React.Fragment key={page}>
              {showEllipsis && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className="h-8 w-8"
              >
                {page}
              </Button>
            </React.Fragment>
          );
        })}

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
