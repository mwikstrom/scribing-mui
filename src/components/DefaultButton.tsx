import clsx from "clsx";
import { alpha, Button, ButtonProps, CircularProgress, Fade, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { forwardRef, useCallback } from "react";
import { BoxVariant } from "scribing";
import { DefaultScribingComponents, ScribingButtonProps} from "scribing-react";
import { mdiAlert } from "@mdi/js";
import { Icon } from "@mdi/react";
import { PaletteColor } from "@material-ui/core/styles/createPalette";

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        hover, // discarded prop
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

    if (buttonVariant) {
        return (
            <Button
                {...otherProps}
                ref={innerRef}
                href={href || ""}
                disabled={disabled}
                variant={buttonVariant}
                color={undefined}
                fullWidth={!inline}
                className={clsx(
                    classes.root,
                    error && classes.interactionFailed,
                    classes[`${boxColor || "default"}Color`],
                )}
                startIcon={<Icon size={1} path={mdiAlert}/>}
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

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        marginRight: theme.spacing(1),
        marginTop: theme.spacing(0.5),
        marginBottom: theme.spacing(0.5),
        transition: theme.transitions.create(["color", "background-color", "border-color"]),
        "& .MuiButton-startIcon": {
            transition: theme.transitions.create(["width", "margin-left", "margin-right", "opacity"]),
            width: 0,
            marginLeft: 0,
            marginRight: 0,
            opacity: 0,
        },
        "&$interactionFailed .MuiButton-startIcon": {
            width: theme.spacing(3),
            marginLeft: theme.spacing(-0.5),
            marginRight: theme.spacing(1),
            opacity: 1,
        },
        "& .ScribingTextSegment-root, & .ScribingDynamicText-root > *": {
            color: "inherit !important",
            fontFamily: "inherit !important",
            fontSize: "inherit !important",
            fontWeight: "inherit !important",
        },
        "&$defaultColor": decorateColorStyle({}, theme.palette),
        "&$subtleColor": decorateColorStyle({
            color: theme.palette.text.secondary,
            "&.MuiButton-outlined": {
                borderColor: theme.palette.type === "light" ? "rgba(0, 0, 0, 0.18)" : "rgba(255, 255, 255, 0.18)",
            },
            "&.MuiButton-contained": {
                backgroundColor: theme.palette.grey[200],
                color: theme.palette.getContrastText(theme.palette.grey[200]),
            },        
        }, theme.palette),
        "&$primaryColor": makeColorStyle(theme.palette.primary, theme.palette),
        "&$secondaryColor": makeColorStyle(theme.palette.secondary, theme.palette),
        "&$informationColor": makeColorStyle(theme.palette.info, theme.palette),
        "&$successColor": makeColorStyle(theme.palette.success, theme.palette),
        "&$warningColor": makeColorStyle(theme.palette.warning, theme.palette),
        "&$errorColor": makeColorStyle(theme.palette.error, theme.palette),
    },
    defaultColor: {},    
    primaryColor: {},
    secondaryColor: {},
    subtleColor: {},
    informationColor: {},
    successColor: {},
    warningColor: {},
    errorColor: {},
    interactionFailed: {},
    pendingIndicator: {
        position: "absolute",
        visibility: "visible",
        display: "flex",
    },
}));

const makeColorStyle = (
    color: PickedColor,
    palette: Theme["palette"],
) => decorateColorStyle(makeColorStyleCore(color, palette), palette);

const decorateColorStyle = (style: Record<string, unknown>, palette: Theme["palette"]) => ({
    ...style,
    "&$interactionFailed": makeColorStyleCore(palette.error, palette),
    "&.Mui-disabled": {
        color: palette.action.disabled,
        "&.MuiButton-outlined": {
            borderColor: palette.action.disabledBackground,
        },
        "&.MuiButton-contained": {
            backgroundColor: palette.action.disabledBackground,
        },
    }
});

type PickedColor = Pick<PaletteColor, "main" | "dark" | "contrastText">;

const makeColorStyleCore = (color: PickedColor, palette: Theme["palette"]) => ({
    color: color.main,
    "&:hover": {
        backgroundColor: alpha(color.main, palette.action.hoverOpacity),
    },
    "&.MuiButton-outlined": {
        borderColor: alpha(color.main, 0.5),
        "&:hover": {
            borderColor: color.main,
        },
    },
    "&.MuiButton-contained": {
        backgroundColor: color.main,
        color: color.contrastText,
        "&:hover": {
            backgroundColor: color.dark,
        }
    },
});
