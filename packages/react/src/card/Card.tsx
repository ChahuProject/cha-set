import React from 'react';

export type CardVariant = 'default' | 'secondary' | 'outline';
export type CardSize = 'default' | 'sm';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card text-card-foreground border-border shadow-xs',
  secondary: 'bg-secondary text-secondary-foreground border-border shadow-xs',
  outline: 'bg-transparent text-foreground border-border',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', size = 'default', interactive = false, style, children, ...props }, ref) => {
    const spacingStyle = {
      '--card-spacing': size === 'sm' ? '0.75rem' : '1rem',
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        data-slot="card"
        data-variant={variant}
        data-size={size}
        data-interactive={interactive ? 'true' : undefined}
        style={spacingStyle}
        className={`rounded-xl border transition-all ${variantStyles[variant]} ${size === 'sm' ? 'text-xs' : ''} ${interactive ? 'cursor-pointer hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5' : ''} ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={`grid grid-cols-[1fr_auto] items-start gap-1.5 p-[var(--card-spacing,1rem)] ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        data-slot="card-title"
        className={`col-start-1 font-semibold leading-none tracking-tight text-base text-card-foreground ${className}`.trim()}
        {...props}
      >
        {children}
      </h3>
    );
  },
);
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        data-slot="card-description"
        className={`col-start-1 text-sm text-muted-foreground ${className}`.trim()}
        {...props}
      >
        {children}
      </p>
    );
  },
);
CardDescription.displayName = 'CardDescription';

export const CardAction = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={`col-start-2 row-span-2 row-start-1 self-start justify-self-end ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardAction.displayName = 'CardAction';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={`p-[var(--card-spacing,1rem)] pt-0 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={`flex items-center p-[var(--card-spacing,1rem)] gap-2 border-t border-border/50 bg-muted/20 rounded-b-xl ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = 'CardFooter';
