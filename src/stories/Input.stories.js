import { fn } from '@storybook/test';
import Input from '../components/Input';

export default {
  title: 'Example/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  args: { 
    id: 'input',
    label: 'Label',
    value: 'Value',
    onChange: fn()
  },
};

export const Error = {
  args: {
    error: 'Error',
  },
};

export const NoLabel = {
  args: {
    label: null
  },
};
