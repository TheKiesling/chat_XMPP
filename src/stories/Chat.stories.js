import Chat from "../components/Chat/Chat";

export default {
    title: 'Components/Chat',
    component: Chat,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Primary = {
    args: {
        messages: [
            {
                sender: 'me',
                body: 'Hello, how are you?'
            },
            {
                sender: 'other',
                body: 'Hi! I am fine, thank you.'
            },
            {
                sender: 'me',
                body: 'Great! I am glad to hear that.'
            },
            {
                sender: 'other',
                body: 'How can I help you?'
            },
            {
                sender: 'me',
                body: 'I need some help with my account.'
            },
            {
                sender: 'other',
                body: 'Sure! I can help you with that.'
            },
            {
                sender: 'other',
                body: 'Please, provide me with your username.'
            }
        ]
    }
};