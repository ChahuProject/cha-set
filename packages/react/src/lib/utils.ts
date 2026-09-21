import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-nano',
        'text-micro',
        'text-caption',
        'text-small',
        'text-body',
        'text-heading',
        'text-subheading',
        'text-title-sm',
        'text-title-md',
        'text-title',
        'text-display',
      ],
    },
  },
});

/** Merge conditional class values, resolving Tailwind conflicts last-wins. */
export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
