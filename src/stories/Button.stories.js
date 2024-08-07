import { fn } from '@storybook/test';
import Button from '../components/Button/Button';

export default {
  title: 'Example/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { 
    children: 'Button',
    onClick: fn(),
    disabled: false,
    primary: false
  },
};

export const Primary = {
  args: {
    primary: true,
  },
};

export const Secondary = {
  args: {
    primary: false
  },
};

export const Disabled = {
  args: {
    disabled: true,
    primary: true
  },
};