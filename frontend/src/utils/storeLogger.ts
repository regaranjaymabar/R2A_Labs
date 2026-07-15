export interface StoreActivityLog {
    id: string;
    title: string;
    description: string;
    timestamp: string;
    type: 'add' | 'update' | 'delete' | 'profile' | 'info';
}

const STORAGE_KEY_PREFIX = 'store_activity_logs_';

export const storeLogger = {
    getLogs: (storeId?: number | string): StoreActivityLog[] => {
        try {
            const key = `${STORAGE_KEY_PREFIX}${storeId || 'default'}`;
            const data = localStorage.getItem(key);
            if (!data) return [];
            return JSON.parse(data);
        } catch (e) {
            console.error("Error reading store logs:", e);
            return [];
        }
    },

    addLog: (
        title: string,
        description: string,
        type: StoreActivityLog['type'] = 'info',
        storeId?: number | string
    ): void => {
        try {
            const key = `${STORAGE_KEY_PREFIX}${storeId || 'default'}`;
            const currentLogs = storeLogger.getLogs(storeId);
            const newLog: StoreActivityLog = {
                id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
                title,
                description,
                timestamp: new Date().toISOString(),
                type,
            };
            const updatedLogs = [newLog, ...currentLogs].slice(0, 25);
            localStorage.setItem(key, JSON.stringify(updatedLogs));
        } catch (e) {
            console.error("Error saving store log:", e);
        }
    },

    clearLogs: (storeId?: number | string): void => {
        try {
            const key = `${STORAGE_KEY_PREFIX}${storeId || 'default'}`;
            localStorage.removeItem(key);
        } catch (e) {
            console.error("Error clearing store logs:", e);
        }
    }
};
