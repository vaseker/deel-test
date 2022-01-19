import { useCallback, useEffect, useRef } from 'react';

// typical debounce, I remember few corner cases as solved related puzzles on leetcode
export default function useDebounce<P extends any[]>(callback: (...args: P) => void, pause: number = 0) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const removeTimer = useCallback(() => {
        if (!timer.current) {
            return
        }

        clearTimeout(timer.current);
        timer.current = null;
    }, []);

    const handler = useCallback((...args: P) => {
        if (pause < 1) {
            return callback.apply(callback, args);
        }

        removeTimer();
        timer.current = setTimeout(() => {
            callback.apply(callback, args)
            removeTimer();
        }, pause);
    }, [callback, pause, removeTimer]);

    useEffect(() => {
        return removeTimer;
    }, [removeTimer]);

    return handler;
}
