type LogoutListener = () => void;

const listeners: LogoutListener[] = [];

export const subscribeLogout = (listener: LogoutListener) => {
    listeners.push(listener);
    return () => {
        const idx = listeners.indexOf(listener);
        if (idx >= 0) listeners.splice(idx, 1);
    };
};

export const emitLogout = () => {
    listeners.slice().forEach((l) => {
        try {
            l();
        } catch (e) {
            // ignore listener errors
            // eslint-disable-next-line no-console
            console.warn('[authEvents] listener error', e);
        }
    });
};
