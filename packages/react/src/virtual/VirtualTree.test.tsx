import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { VirtualTree } from './VirtualTree';

interface TreeNode {
  id: string;
  name: string;
  children?: TreeNode[];
}

describe('VirtualTree', () => {
  const treeData: TreeNode[] = [
    {
      id: 'root-1',
      name: 'Folder 1',
      children: [
        { id: 'child-1-1', name: 'File 1.1' },
        { id: 'child-1-2', name: 'File 1.2' },
      ],
    },
    {
      id: 'root-2',
      name: 'Folder 2',
    },
  ];

  it('renders root nodes and handles expand/collapse', () => {
    render(
      <VirtualTree
        rootNodes={treeData}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
        renderRow={({ node, hasChildren, isExpanded, toggleExpand }) => (
          <div>
            <span>{node.name}</span>
            {hasChildren && (
              <button type="button" onClick={toggleExpand}>
                {isExpanded ? 'Collapse' : 'Expand'}
              </button>
            )}
          </div>
        )}
      />,
    );

    expect(screen.getByText('Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Folder 2')).toBeInTheDocument();
    expect(screen.queryByText('File 1.1')).not.toBeInTheDocument();

    const expandBtn = screen.getByText('Expand');
    fireEvent.click(expandBtn);

    expect(screen.getByText('File 1.1')).toBeInTheDocument();
  });

  it('supports programmatic expandAll and collapseAll via ref handle', () => {
    const ref = React.createRef<any>();
    render(
      <VirtualTree
        ref={ref}
        rootNodes={treeData}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
      />,
    );

    expect(screen.queryByText('File 1.1')).not.toBeInTheDocument();

    expect(ref.current).toBeDefined();
    expect(typeof ref.current?.expandAll).toBe('function');
    expect(typeof ref.current?.collapseAll).toBe('function');

    act(() => {
      ref.current.expandAll();
    });
    expect(screen.getByText('File 1.1')).toBeInTheDocument();

    act(() => {
      ref.current.collapseAll();
    });
    expect(screen.queryByText('File 1.1')).not.toBeInTheDocument();
  });

  it('supports selectedId and onSelectNode callback', () => {
    let selected: any = null;
    render(
      <VirtualTree
        rootNodes={treeData}
        selectedId="root-2"
        onSelectNode={(n) => {
          selected = n;
        }}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
      />,
    );

    const folder2 = screen.getByText('Folder 2');
    expect(folder2).toBeInTheDocument();
    fireEvent.click(folder2);
    expect(selected?.id).toBe('root-2');
  });
});
