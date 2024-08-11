import ProfilePhoto from "../components/ProfilePhoto";

export default {
    title: 'Components/ProfilePhoto',
    component: ProfilePhoto,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export const available = {
    args: {
        initial: 'A',
        state: 'available',
    }
};

export const absent = {
    args: {
        initial: 'A',
        state: 'absent',
    }
};

export const notAvailable = {
    args: {
        initial: 'A',
        state: 'notAvailable',
    }
};

export const busy = {
    args: {
        initial: 'A',
        state: 'busy',
    }
};

export const away = {
    args: {
        initial: 'A',
        state: 'away',
    }
};
