import * as React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
});
