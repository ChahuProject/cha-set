import React from 'react';

export type CardVariant = 'default' | 'secondary' | 'outline';
export type CardSize = 'default' | 'sm';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
}

const variantStyles: Record<CardVariant, string> = {
  default: 'bg-card text-card-foreground border-border shadow-xs',
  secondary: 'bg-secondary text-secondary-foreground border-border shadow-xs',
  outline: 'bg-transparent text-foreground border-border',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        data-variant={variant}
        data-size={size}
        className={`rounded-xl border transition-colors ${variantStyles[variant]} ${size === 'sm' ? 'text-xs p-3' : ''} ${className}`.trim()}
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
        className={`flex flex-col gap-1.5 p-6 ${className}`.trim()}
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
        className={`font-semibold leading-none tracking-tight text-lg text-card-foreground ${className}`.trim()}
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
        className={`text-sm text-muted-foreground ${className}`.trim()}
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
        className={`p-6 pt-0 ${className}`.trim()}
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
        className={`flex items-center p-6 pt-0 gap-2 ${className}`.trim()}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = 'CardFooter';
