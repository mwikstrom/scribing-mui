import { Typography } from "@material-ui/core";
import { mdiDatabaseExport, mdiDatabaseImport, mdiSync } from "@mdi/js";
import Icon from "@mdi/react";
import React, { FC, useMemo } from "react";
import { EditorSourceState } from "../FlowEditorToolbar";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface CheckInOutButtonProps extends ToolButtonProps {
    showLabel?: boolean;
    source?: EditorSourceState;
    onCheckIn?: () => void;
    onCheckOut?: () => void;
}

export const CheckInOutButton: FC<CheckInOutButtonProps> = props => {
    const { showLabel, source, onCheckIn, onCheckOut, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const { label, icon, spin, onClick } = useMemo(() => {
        if (source === "busy") {
            return {
                label: locale.label_please_wait,
                icon: mdiSync,
                spin: -1,
                onClick: noop,
            };
        } else if (source === "checked-in") {
            return {
                label: locale.button_check_out,
                icon: mdiDatabaseExport,
                spin: false,
                onClick: onCheckOut,
            };
        } else if (source === "checked-out") {
            return {
                label: locale.button_check_in,
                icon: mdiDatabaseImport,
                spin: false,
                onClick: onCheckIn,
            };
        } else {
            return {
                label: "",
                icon: "",
                spin: false,
                onClick: noop,
            };
        }
    }, [source, locale, onCheckIn, onCheckOut]);

    if (!icon) {
        return null;
    }

    return (
        <ToolButton
            {...rest}
            startIcon={showLabel && label && <Icon size={0.75} path={icon} spin={spin}/>}
            onClick={onClick}
            children={showLabel ? (
                <Typography variant="body2">{label}</Typography>
            ) : (
                <Icon size={1} path={icon} spin={spin}/>
            )}
        />
    );
};

const noop = () => void(0);
