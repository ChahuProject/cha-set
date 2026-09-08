import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from './Select';

describe('Select', () => {
  it('renders trigger with placeholder', () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('Select fruit')).toBeInTheDocument();
  });

  it('renders options when opened', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Choose option" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
  });

  it('supports disabled trigger', () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled select" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeDisabled();
  });

  it('supports sm size trigger', () => {
    render(
      <Select>
        <SelectTrigger size="sm">
          <SelectValue placeholder="Compact" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1">Option 1</SelectItem>
        </SelectContent>
      </Select>,
    );

    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('data-size', 'sm');
  });

  it('renders item label instead of raw numeric value in trigger', () => {
    render(
      <Select defaultValue="0">
        <SelectTrigger>
          <SelectValue placeholder="选择阶段" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">顶点着色器</SelectItem>
          <SelectItem value="1">片元着色器</SelectItem>
        </SelectContent>
      </Select>,
    );

    // 初始关闭状态下，trigger 应显示“顶点着色器”，而不是数字 "0"
    expect(screen.getByText('顶点着色器')).toBeInTheDocument();
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders itemText instead of children with action buttons in trigger', () => {
    render(
      <Select defaultValue="preset-1">
        <SelectTrigger>
          <SelectValue placeholder="选择预设" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="preset-1" itemText="基准方案 A">
            <span>基准方案 A</span>
            <button type="button">删除</button>
          </SelectItem>
        </SelectContent>
      </Select>,
    );

    expect(screen.getByText('基准方案 A')).toBeInTheDocument();
    // 触发器中不应渲染内层带有删除按钮的完整 DOM
    const trigger = screen.getByRole('combobox');
    expect(trigger.querySelector('button')).toBeNull();
  });
});
