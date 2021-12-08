import { useCallback, useEffect, useState } from "react";

export function useElementSize(element: HTMLElement | null): { width: number, height: number } {
    const computeSize = useCallback(() => {
        let width = 0;
        let height = 0;
        if (element) {
            width = element.clientWidth;
            height = element.clientHeight;
        }
        return { width, height };
    }, [element]);
    const [size, setSize] = useState(computeSize);
    useEffect(() => {
        if (element) {
            const observer = new ResizeObserver(() => setSize(computeSize()));
            observer.observe(element);
            setSize(computeSize());
            return () => { observer.disconnect(); };
        }
    }, [element, computeSize, setSize]);
    return size;
}
