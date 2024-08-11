import ChatInput from "../components/ChatInput";
import { fn } from '@storybook/test';

export default {
    title: 'Components/ChatInput',
    component: ChatInput,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    args: { 
        children: 'ChatInput',
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