import clsx from "clsx";
import { Button, ButtonProps, CircularProgress, Fade, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { forwardRef, useCallback } from "react";
import { BoxVariant, FlowColor } from "scribing";
import { DefaultScribingComponents, ScribingButtonProps} from "scribing-react";
import { mdiAlert } from "@mdi/js";
import { Icon } from "@mdi/react";

export const DefaultButton = forwardRef<HTMLElement, ScribingButtonProps>((props, outerRef) => {
    const {
        children,
        disabled,
        pending,
        error,
        style: {
            color: boxColor,
            variant: boxVariant,
            inline
        },
        href,
        ...otherProps
    } = props;

    const innerRef = useCallback((elem: HTMLElement | null) => {
        if (typeof outerRef === "function") {
            outerRef(elem);
        } else if (outerRef !== null) {
            outerRef.current = elem;
        }
    }, [outerRef]);

    const classes = useStyles();
    const buttonVariant = boxVariant && ButtonVariantMapping[boxVariant];
    const buttonColor = ButtonColorMapping[boxColor || "default"];

    if (buttonVariant && buttonColor) {
        return (
            <Button
                {...otherProps}
                ref={innerRef}
                href={href || ""}
                disabled={disabled || pending}
                variant={buttonVariant}
                color={buttonColor}
                fullWidth={!inline}
                className={clsx(
                    classes.root,
                    error && classes.error,
                )}
                startIcon={error && <Icon size={1} path={mdiAlert}/>}
                children={(
                    <>
                        {pending && (
                            <div className={classes.pendingIndicator}>
                                <CircularProgress color="inherit" size={16} />
                            </div>
                        )}
                        <Fade in={!pending}>
                            <div>{children}</div>
                        </Fade>
                    </>
                )}
            />
        );
    } else {
        return (
            <DefaultScribingComponents.Button
                {...props}
                ref={innerRef}
            />
        );
    }
});

const ButtonVariantMapping: Partial<Record<BoxVariant, ButtonProps["variant"]>> = {
    basic: "text",
    outlined: "outlined",
    contained: "contained",
};

const ButtonColorMapping: Partial<Record<FlowColor, ButtonProps["color"]>> = {
    default: "default",
    primary: "primary",
    secondary: "secondary",
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        "& .ScribingTextSegment-root, & .ScribingDynamicText-root > *": {
            color: "inherit !important",
            fontFamily: "inherit !important",
            fontSize: "inherit !important",
            fontWeight: "inherit !important",
        }
    },    
    error: {
        color: `${theme.palette.error.main} !important`,
        borderColor: `${theme.palette.error.main} !important`,
    },
    pendingIndicator: {
        position: "absolute",
        visibility: "visible",
        display: "flex",
    },
}));
