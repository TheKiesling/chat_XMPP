import ContactList from "../components/ContactList/ContactList";

export default {
    title: "Components/ContactList",
    component: ContactList,
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
};

export const Default = {
    args: {
        contacts: [
            {
                username: {
                    name: 'John Doe',
                    state: 'available',
                },
                lastMessage: {
                    from: "Jane Doe",
                    content: "Hello!",
                    date: "01/01/2021",
                },
            },
            {
                username: {
                    name: 'Jane Doe',
                    state: 'available',
                },
                lastMessage: {
                    from: "John Doe",
                    content: "Hello!",
                    date: "01/01/2021",
                },
            },
            {
                username: {
                    name: 'John Doe',
                    state: 'available',
                },
                lastMessage: {
                    from: "Jane Doe",
                    content: "Hello!",
                    date: "01/01/2021",
                },
            },
            {
                username: {
                    name: 'Jane Doe',
                    state: 'available',
                },
                lastMessage: {
                    from: "John Doe",
                    content: "Hello!",
                    date: "01/01/2021",
                },
            },
        ],
    },
};