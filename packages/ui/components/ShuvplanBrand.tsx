import React from 'react';

interface ShuvplanBrandProps {
  compact?: boolean;
  href?: string;
  className?: string;
}

export const ShuvplanBrand: React.FC<ShuvplanBrandProps> = ({
  compact = false,
  href = 'https://plan.shuv.dev',
  className = '',
}) => {
  const content = (
    <>
      <span className="sp-brand-mark h-7 w-7 text-[11px] font-black tracking-normal">sp</span>
      {!compact && (
        <span className="font-display text-sm font-bold tracking-normal text-foreground">
          shuvplan
        </span>
      )}
    </>
  );

  const classes = `inline-flex min-w-0 items-center gap-2 transition-opacity hover:opacity-85 ${className}`;

  if (!href) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  );
};
