import type { ReactElement, ReactNode } from 'react';
import { Children, cloneElement, isValidElement } from 'react';

/* eslint-disable react/no-children-for-each, react/no-clone-element --
   弹窗体需把 children 按类型拆成「滚动区 + 底部固定区」，属组件库正当用途 */

/**
 * Result of splitting children into main content and a fixed footer component.
 */
export interface SplitFixedFooterResult {
  content: ReactNode[];
  fixedFooter: ReactNode;
  /** 中文兼容别名 */
  内容: ReactNode[];
  /** 中文兼容别名 */
  底部固定区: ReactNode;
}

/**
 * Extracts a fixed footer element (such as DialogFooter) from children,
 * returning the remaining children as a content array with keys patched.
 *
 * 从 children 中按组件类型提取「底部固定区」元素（如 DialogFooter），其余作为内容数组返回，并自动补全 key。
 *
 * @param children - The children to split / 待拆分的子元素树
 * @param footerComponent - The React component type to match as the footer / 底部组件类型
 */
export function splitFixedFooter(
  children: ReactNode,
  footerComponent: React.ElementType,
): SplitFixedFooterResult {
  let fixedFooter: ReactNode = null;
  const content: ReactNode[] = [];

  Children.forEach(children, (child, index) => {
    if (
      fixedFooter === null &&
      isValidElement(child) &&
      (child.type === footerComponent ||
        (child.props as any)?.['data-slot'] === 'dialog-footer' ||
        (child.type as any)?.displayName === 'DialogFooter')
    ) {
      fixedFooter = child;
    } else if (isValidElement(child)) {
      // cloneElement ensures unique key when rendering as array
      content.push(cloneElement(child as ReactElement, { key: child.key ?? index }));
    } else {
      content.push(child);
    }
  });

  return {
    content,
    fixedFooter,
    内容: content,
    底部固定区: fixedFooter,
  };
}

/** 中文别名 */
export const 拆底部固定区 = splitFixedFooter;
