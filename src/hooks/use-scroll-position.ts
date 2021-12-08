import { useCallback, useState } from "react";
import { useNativeEventHandler } from "./use-native-event-handler";

export function useScrollPosition(element: HTMLElement | null): { left: number, top: number } {
    const computePosition = useCallback(() => {
        let left = 0;
        let top = 0;
        if (element) {
            left = element.scrollLeft;
            top = element.scrollTop;
        }
        return { left, top };
    }, [element]);
    const [position, setPosition] = useState(computePosition);
    useNativeEventHandler(element, "scroll", () => setPosition(computePosition()), [computePosition, setPosition]);
    return position;
}
