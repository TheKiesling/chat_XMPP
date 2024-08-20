import ContactInfo from "../components/ContactInfo";

export default {
    title: 'Components/ContactInfo',
    component: ContactInfo,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const Default = {
    args: {
        contact: {
            name: 'John Doe',
            state: 'available',
            messageStatus: 'Hello, I am using XMPP.',
        },
    }
};


