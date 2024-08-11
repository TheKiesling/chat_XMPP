import Message from "../components/Message";

export default {
    title: 'Components/Message',
    component: Message,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const RecieveMessage = {
    args: {
        message: {
            sender: 'other',
            body: 'Hello!'
        }
    }
};

export const SendMessage = {
    args: {
        message: {
            sender: 'me',
            body: 'Hello!'
        }
    }
};
