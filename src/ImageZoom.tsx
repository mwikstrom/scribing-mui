import { alpha, IconButton, Modal, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import clsx from "clsx";
import { ScribingImageZoomProps } from "scribing-react";

// TODO: Keep center point when zooming in
// TODO: Pinch-to-zoom gesture
export const ImageZoom = (props: ScribingImageZoomProps): JSX.Element => {
    const { sourceUrl, sourceWidth, sourceHeight, onClose } = props;
    const classes = useStyles();
    const [minScale, setMinScale] = useState(0.1);
    const maxScale = 4;
    const [scale, setScale] = useClamped(minScale, minScale, maxScale);
    const [limitX, setLimitX] = useState(0);
    const [limitY, setLimitY] = useState(0);
    const [root, setRoot] = useState<HTMLElement | null>(null);
    const [dragOrigin, setDragOrigin] = useState<[number, number]>();
    const [translateX, setTranslateX] = useClamped(0, -limitX, limitX);
    const [translateY, setTranslateY] = useClamped(0, -limitY, limitY);
    const transform = [
        `translateX(${translateX}px)`, 
        `translateY(${translateY}px)`, 
        `scale(${scale})`,
    ].join(" ");

    const onWheel = useCallback((e: React.WheelEvent) => {
        const { deltaY } = e;
        const multiplier = deltaY > 0 ? 0.8 : deltaY < 0 ? 1.25 : 1;
        setScale(before => before * multiplier);
    }, [setScale]);

    const onMouseDown = useCallback((e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        setDragOrigin([clientX, clientY]);
    }, []);

    const onMouseMove = useCallback((e: React.MouseEvent) => {
        if (dragOrigin) {
            if ((e.buttons & 1) === 1) {
                const { clientX, clientY } = e;
                const [originX, originY] = dragOrigin;
                setTranslateX(before => before + clientX - originX);
                setTranslateY(before => before + clientY - originY);
                setDragOrigin([clientX, clientY]);
            } else {
                setDragOrigin(undefined);
            }
        }
    }, [dragOrigin, setTranslateX, setTranslateY]);

    const onMouseUp = useCallback(() => setDragOrigin(undefined), []);
    
    useEffect(() => {
        if (root) {
            const callback = () => {
                const { clientWidth, clientHeight } = root;
                setLimitX(Math.max(0, sourceWidth * scale / 2 - clientWidth / 2));
                setLimitY(Math.max(0, sourceHeight * scale / 2 - clientHeight / 2));
                setMinScale(Math.min(clientWidth / sourceWidth, clientHeight / sourceHeight));
            };
            const observer = new ResizeObserver(callback);
            observer.observe(root);
            callback();
            return () => observer.disconnect();
        } else {
            setMinScale(0.1);
        }
    }, [root, sourceWidth, sourceHeight, scale]);

    return (
        <Modal open onClose={onClose}>
            <div className={classes.root} onWheel={onWheel} ref={setRoot}>
                <img
                    className={clsx(classes.imageElement, dragOrigin && classes.dragging)}
                    src={sourceUrl}
                    style={{ transform }}
                    onMouseDown={onMouseDown}
                    onMouseMoveCapture={onMouseMove}
                    onMouseUpCapture={onMouseUp}
                    draggable={false}
                />
                <IconButton onClick={onClose} className={classes.closeButton}>
                    <Icon path={mdiClose} size={1} />
                </IconButton>
            </div>
        </Modal>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(10px)",

    },
    imageElement: {
        cursor: "grab",
        userSelect: "none",
        "&$dragging": {
            cursor: "grabbing",
        },
    },
    dragging: {},
    closeButton: {
        position: "absolute",
        top: theme.spacing(1),
        right: theme.spacing(1),
        backgroundColor: alpha(theme.palette.background.default, 0.5),
        color: theme.palette.text.primary,
        "&:hover": {
            backgroundColor: alpha(theme.palette.background.default, 0.75),
        },
    }
}));

const useClamped = (
    initial: number,
    min: number,
    max: number
): [number, (callback: (before: number) => number) => void] => {
    const [state, setState] = useState(Math.max(min, Math.min(max, initial)));
    const setClamped = useCallback((callback: (before: number) => number) => {
        setState(before => Math.max(min, Math.min(max, callback(before))));
    }, [setState, min, max]);
    useLayoutEffect(() => {
        if (state < min || state > max) {
            setState(before => Math.max(min, Math.min(max, before)));
        }
    }, [state, setState, min, max]);
    return [state, setClamped];
};
