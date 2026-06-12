import React from 'react';
import { BookOpen, Wifi, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BrandLogo({ compact = false, className = '' }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <BookOpen className="h-6 w-6" />
        <Wifi className="absolute -top-2 h-5 w-5 text-secondary" />
        <Download className="absolute bottom-1 h-4 w-4 text-accent" />
      </div>
      {!compact && (
        <div className="leading-tight">
          <h1 className="text-lg font-bold text-sidebar-foreground">
            Learn<span className="text-secondary">Bridge</span>
          </h1>
          <p className="text-xs text-sidebar-foreground/65">Adaptive E-Learning PWA</p>
        </div>
      )}
    </div>
  );
}
