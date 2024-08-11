import Contact from "../components/Contact/Contact";

export default {
    title: 'Components/Contact',
    component: Contact,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const RecieveMessage = {
    args: {
        username: {
            name: 'John Doe',
            state: 'available',
        },
        lastMessage: {
            from: 'Jane Doe',
            content: 'Hello!',
            date: '01/01/2021',
        },
    }
};

export const SendMessage = {
    args: {
        username: {
            name: 'Jane Doe',
            state: 'available',
        },
        lastMessage: {
            from: 'Jane Doe',
            content: 'Hello!',
            date: '01/01/2021',
        },
    }
};

export const withouthMessage = {
    args: {
        username: {
            name: 'Jane Doe',
            state: 'available',
        },
        lastMessage: null
    }
};