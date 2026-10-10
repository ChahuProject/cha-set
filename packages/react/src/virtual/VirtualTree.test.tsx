import * as React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, createEvent, act } from '@testing-library/react';
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

  it('supports multi-selection with Ctrl and Shift clicks', () => {
    let selectedKeys: string[] = [];
    render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        selectionMode="multiple"
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        onSelectionChange={(keys) => {
          selectedKeys = keys;
        }}
        estimateSize={30}
      />,
    );

    // Initial click on File 1.1 (already expanded due to defaultExpandDepth=2)
    const file1 = screen.getByText('File 1.1');
    fireEvent.click(file1);
    expect(selectedKeys).toEqual(['child-1-1']);

    // Ctrl+Click on File 1.2 toggles selection without clearing File 1.1
    const file2 = screen.getByText('File 1.2');
    fireEvent.click(file2, { ctrlKey: true });
    expect(selectedKeys).toContain('child-1-1');
    expect(selectedKeys).toContain('child-1-2');

    // Shift+Click on Folder 2 range selects from anchor
    const folder2 = screen.getByText('Folder 2');
    fireEvent.click(folder2, { shiftKey: true });
    expect(selectedKeys).toContain('child-1-2');
    expect(selectedKeys).toContain('root-2');
  });

  it('renders dimmed state when nodes are in dimmedIds', () => {
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        dimmedIds={['child-1-1']}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
      />,
    );

    const dimmedRow = container.querySelector('[data-dimmed="true"]');
    expect(dimmedRow).toBeInTheDocument();
    expect(dimmedRow?.textContent).toContain('File 1.1');
  });

  it('triggers clipboard shortcuts onCut, onCopy, onPaste, and onDelete', () => {
    let cutNodes: any[] = [];
    let copyNodes: any[] = [];
    let pasteTarget: any = null;
    let deleteNodes: any[] = [];

    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        selectionMode="multiple"
        defaultSelectedIds={['root-1']}
        onCut={(nodes) => {
          cutNodes = nodes;
        }}
        onCopy={(nodes) => {
          copyNodes = nodes;
        }}
        onPaste={(target) => {
          pasteTarget = target;
        }}
        onDelete={(nodes) => {
          deleteNodes = nodes;
        }}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
      />,
    );

    const treeRoot = container.querySelector('[role="tree"]')!;

    // Test Ctrl+X
    fireEvent.keyDown(treeRoot, { key: 'x', ctrlKey: true });
    expect(cutNodes.length).toBe(1);
    expect(cutNodes[0].id).toBe('root-1');

    // Test Ctrl+C
    fireEvent.keyDown(treeRoot, { key: 'c', ctrlKey: true });
    expect(copyNodes.length).toBe(1);
    expect(copyNodes[0].id).toBe('root-1');

    // Test Ctrl+V
    fireEvent.keyDown(treeRoot, { key: 'v', ctrlKey: true });
    expect(pasteTarget).toBeDefined();

    // Test Delete
    fireEvent.keyDown(treeRoot, { key: 'Delete' });
    expect(deleteNodes.length).toBe(1);
    expect(deleteNodes[0].id).toBe('root-1');
  });

  it('supports drag-and-drop reordering, inside nesting, and cycle prevention', () => {
    let dropEvent: any = null;

    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        enableDnd
        onDropNode={(evt) => {
          dropEvent = evt;
        }}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={30}
      />,
    );

    const file1Row = container.querySelector('[data-index="1"]') as HTMLElement;
    const file2Row = container.querySelector('[data-index="2"]') as HTMLElement;
    const folder1Row = container.querySelector('[data-index="0"]') as HTMLElement;

    expect(file1Row.getAttribute('draggable')).toBe('true');

    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 140,
      left: 0,
      right: 300,
      width: 300,
      height: 40,
      x: 0,
      y: 100,
      toJSON: () => {},
    } as DOMRect);

    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(),
      effectAllowed: 'none',
      dropEffect: 'none',
    };

    // 1. Drag start on File 1.1
    fireEvent.dragStart(file1Row, { dataTransfer });
    expect(dataTransfer.setData).toHaveBeenCalledWith('text/plain', JSON.stringify(['child-1-1']));
    expect(dataTransfer.effectAllowed).toBe('copyMove');

    // 2. Drag over top of File 1.2 (ratio < 0.25 -> 'before')
    const activeFile2Row = container.querySelector('[data-index="2"]') as HTMLElement;
    const dragOverEvt = createEvent.dragOver(activeFile2Row, { dataTransfer });
    Object.defineProperty(dragOverEvt, 'clientY', { value: 105 });
    fireEvent(activeFile2Row, dragOverEvt);

    expect(activeFile2Row.getAttribute('data-drop-position')).toBe('before');
    expect(activeFile2Row.getAttribute('data-drop-valid')).toBe('true');

    // 3. Drop on File 1.2
    fireEvent.drop(activeFile2Row, { dataTransfer });
    expect(dropEvent).toBeDefined();
    expect(dropEvent.sourceKeys).toEqual(['child-1-1']);
    expect(dropEvent.targetKey).toBe('child-1-2');
    expect(dropEvent.position).toBe('before');
    expect(dropEvent.isCopy).toBeFalsy();

    // 4. Test Ctrl+Drop for copy mode
    fireEvent.dragStart(file1Row, { dataTransfer });
    const dragOverCtrlEvt = createEvent.dragOver(activeFile2Row, { dataTransfer });
    Object.defineProperty(dragOverCtrlEvt, 'clientY', { value: 105 });
    Object.defineProperty(dragOverCtrlEvt, 'ctrlKey', { value: true });
    fireEvent(activeFile2Row, dragOverCtrlEvt);
    const dropCtrlEvt = createEvent.drop(activeFile2Row, { dataTransfer });
    Object.defineProperty(dropCtrlEvt, 'ctrlKey', { value: true });
    fireEvent(activeFile2Row, dropCtrlEvt);
    expect(dropEvent.isCopy).toBe(true);

    // 5. Test cycle prevention: Drag Folder 1 over its child File 1.1
    const activeFolder1Row = container.querySelector('[data-index="0"]') as HTMLElement;
    const activeFile1Row = container.querySelector('[data-index="1"]') as HTMLElement;
    fireEvent.dragStart(activeFolder1Row, { dataTransfer });
    const dragOverEvt2 = createEvent.dragOver(activeFile1Row, { dataTransfer });
    Object.defineProperty(dragOverEvt2, 'clientY', { value: 110 });
    fireEvent(activeFile1Row, dragOverEvt2);

    // Cycle detected: cannot drop parent into child
    expect(activeFile1Row.getAttribute('data-drop-valid')).toBe('false');
  });

  it('renders rows with pixel transforms to prevent scaling gap blowouts under UI scale', () => {
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={32}
      />,
    );

    const content = container.querySelector('[data-slot="virtual-tree-content"]') as HTMLElement;
    expect(content).toBeDefined();
    // Height must be in pixels (not converted with * 0.0625rem which squares the UI scale)
    expect(content.style.height).toMatch(/px$/);

    const row0 = container.querySelector('[data-index="0"]') as HTMLElement;
    expect(row0).toBeDefined();
    expect(row0.style.transform).toMatch(/translateY\(\d+px\)/);
  });

  it('pins the frozen ancestor chain above the scroll area (stickyItems)', () => {
    const onStickySelect = vi.fn();
    const onStickyToggle = vi.fn();
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        defaultExpandDepth={2}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={32}
        stickyItems={[
          { id: 'root-1', label: 'Folder 1', depth: 0, hasChildren: true, isExpanded: true },
          { id: 'child-1-1', label: 'File 1.1', depth: 1, hasChildren: false, isExpanded: false },
        ]}
        onStickySelect={onStickySelect}
        onStickyToggle={onStickyToggle}
      />,
    );

    const sticky = container.querySelector('[data-slot="virtual-tree-sticky"]') as HTMLElement;
    expect(sticky).toBeDefined();
    expect(sticky.className).toContain('sticky');

    const stickyRows = container.querySelectorAll('[data-slot="virtual-tree-sticky-row"]');
    expect(stickyRows).toHaveLength(2);
    expect(stickyRows[0]!.getAttribute('data-sticky-id')).toBe('root-1');
    expect(stickyRows[1]!.getAttribute('data-sticky-id')).toBe('child-1-1');
    // Indentation mirrors the original row depth so the pinned chain reads as a path.
    expect((stickyRows[1] as HTMLElement).style.paddingLeft).toBe('1.5rem');

    // Clicking a pinned row selects it (host navigates); the chevron only toggles.
    fireEvent.click(stickyRows[0]!);
    expect(onStickySelect).toHaveBeenCalledTimes(1);
    expect(onStickyToggle).not.toHaveBeenCalled();

    const chevron = stickyRows[0]!.querySelector('[data-slot="virtual-tree-sticky-chevron"]') as HTMLElement;
    expect(chevron).not.toBeNull();
    fireEvent.click(chevron);
    expect(onStickyToggle).toHaveBeenCalledTimes(1);
    // stopPropagation: toggling a pinned ancestor must not also navigate.
    expect(onStickySelect).toHaveBeenCalledTimes(1);
  });

  it('renders no frozen strip when stickyItems is empty', () => {
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
      />,
    );
    expect(container.querySelector('[data-slot="virtual-tree-sticky"]')).toBeNull();
  });

  it('dynamically flips drag modifier HUD between bottom and top depending on pointer position', () => {
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        enableDnd
        defaultExpandDepth={2}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={32}
      />,
    );

    const row0 = container.querySelector('[data-index="0"]') as HTMLElement;
    expect(row0).toBeDefined();

    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(),
      effectAllowed: 'none',
      dropEffect: 'none',
    };

    // Start dragging root-1
    fireEvent.dragStart(row0, { dataTransfer });

    const scrollContainer = container.querySelector('[data-slot="virtual-tree"]') as HTMLElement;
    expect(scrollContainer).toBeDefined();

    // Mock getBoundingClientRect: top = 0, height = 200
    vi.spyOn(scrollContainer, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 200,
      left: 0,
      right: 200,
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // Pointer in upper half (clientY = 40): HUD should be at bottom
    const evtTop = createEvent.dragOver(scrollContainer, { dataTransfer });
    Object.defineProperty(evtTop, 'clientY', { value: 40 });
    fireEvent(scrollContainer, evtTop);

    let hud = container.querySelector('[data-slot="virtual-tree-drag-hud"]') as HTMLElement;
    expect(hud).not.toBeNull();
    expect(hud.getAttribute('data-hud-position')).toBe('bottom');
    expect(hud.className).toContain('bottom-2');

    // Pointer moves to lower half (clientY = 160): HUD should flip to top
    const evtBottom = createEvent.dragOver(scrollContainer, { dataTransfer });
    Object.defineProperty(evtBottom, 'clientY', { value: 160 });
    fireEvent(scrollContainer, evtBottom);

    hud = container.querySelector('[data-slot="virtual-tree-drag-hud"]') as HTMLElement;
    expect(hud.getAttribute('data-hud-position')).toBe('top');
    expect(hud.className).toContain('top-2');

    // Pointer moves back to upper half (clientY = 30): HUD should flip back to bottom
    const evtTopAgain = createEvent.dragOver(scrollContainer, { dataTransfer });
    Object.defineProperty(evtTopAgain, 'clientY', { value: 30 });
    fireEvent(scrollContainer, evtTopAgain);

    hud = container.querySelector('[data-slot="virtual-tree-drag-hud"]') as HTMLElement;
    expect(hud.getAttribute('data-hud-position')).toBe('bottom');
    expect(hud.className).toContain('bottom-2');

    // Multi-line HUD content verification (locale-tolerant: zh-CN or en-US)
    expect(hud.textContent).toMatch(/松开左键|Release left/);
    expect(hud.textContent).toMatch(/移动到目标|Move to target/);
    expect(hud.textContent).toMatch(/按住 Ctrl|Hold Ctrl/);
    expect(hud.textContent).toMatch(/复制到目标|Copy to target/);
    expect(hud.textContent).toMatch(/按 Esc|Press Esc/);
    const mouseGlyphs = hud.querySelectorAll('[data-slot="mouse-glyph"]');
    expect(mouseGlyphs.length).toBeGreaterThanOrEqual(1);

    // Drag ends: HUD is cleaned up
    fireEvent.dragEnd(row0);
    expect(container.querySelector('[data-slot="virtual-tree-drag-hud"]')).toBeNull();
  });

  it('renders collinear seam-centered drop indicators with bullet notches for before and after positions', () => {
    const { container } = render(
      <VirtualTree
        rootNodes={treeData}
        enableDnd
        defaultExpandDepth={2}
        getChildren={(node) => node.children ?? []}
        getNodeKey={(node) => node.id}
        estimateSize={32}
      />,
    );

    const row0 = container.querySelector('[data-index="0"]') as HTMLElement;
    const row1 = container.querySelector('[data-index="1"]') as HTMLElement;
    expect(row0).toBeDefined();
    expect(row1).toBeDefined();

    const dataTransfer = {
      setData: vi.fn(),
      getData: vi.fn(),
      effectAllowed: 'none',
      dropEffect: 'none',
    };

    // Start dragging root-2
    fireEvent.dragStart(row1, { dataTransfer });

    // Mock bounding rect on row0 (top = 0, height = 32)
    vi.spyOn(row0, 'getBoundingClientRect').mockReturnValue({
      top: 0,
      bottom: 32,
      left: 0,
      right: 200,
      width: 200,
      height: 32,
      x: 0,
      y: 0,
      toJSON: () => {},
    } as DOMRect);

    // Hover near top of row0 (clientY = 4, ratio < 0.25 -> before)
    const evtBefore = createEvent.dragOver(row0, { dataTransfer });
    Object.defineProperty(evtBefore, 'clientY', { value: 4 });
    fireEvent(row0, evtBefore);

    const beforeIndicator = container.querySelector('[data-slot="drop-indicator-before"]') as HTMLElement;
    expect(beforeIndicator).not.toBeNull();
    // Collinear seam-centering classes and bullet notch
    expect(beforeIndicator.className).toContain('-translate-y-1/2');
    expect(beforeIndicator.className).toContain('top-0');
    expect(beforeIndicator.firstElementChild?.className).toContain('rounded-full');

    // Hover near bottom of row0 (clientY = 28, ratio > 0.75 -> after)
    const evtAfter = createEvent.dragOver(row0, { dataTransfer });
    Object.defineProperty(evtAfter, 'clientY', { value: 28 });
    fireEvent(row0, evtAfter);

    const afterIndicator = container.querySelector('[data-slot="drop-indicator-after"]') as HTMLElement;
    expect(afterIndicator).not.toBeNull();
    // Collinear seam-centering classes and bullet notch
    expect(afterIndicator.className).toContain('translate-y-1/2');
    expect(afterIndicator.className).toContain('bottom-0');
    expect(afterIndicator.firstElementChild?.className).toContain('rounded-full');

    fireEvent.dragEnd(row1);
  });
});
