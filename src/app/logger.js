const MAX_ENTRIES = 200;

export const AppLogger = {
    _entries: [],
    _subscribers: [],
    _counter: 0,

    log(level, category, message) {
        this._counter += 1;
        const entry = {
            id: this._counter,
            timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
            level,
            category,
            message: String(message)
        };

        this._entries.unshift(entry);

        if (this._entries.length > MAX_ENTRIES) {
            this._entries.length = MAX_ENTRIES;
        }

        this._subscribers.forEach((fn) => {
            try { fn(entry); } catch (_) { /* noop */ }
        });
    },

    getLogs() {
        return [...this._entries];
    },

    clear() {
        this._entries = [];
        this._subscribers.forEach((fn) => {
            try { fn(null); } catch (_) { /* noop */ }
        });
    },

    subscribe(fn) {
        this._subscribers.push(fn);
    },

    unsubscribe(fn) {
        this._subscribers = this._subscribers.filter((s) => s !== fn);
    }
};
