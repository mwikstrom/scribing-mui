import { mdiCreation } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowIcon } from "scribing";
import { FlowEditorController } from "scribing-react";
import { IconDialog } from "../components/IconDialog";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface FlowIconButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const FlowIconButton: FC<FlowIconButtonProps> = props => {
    const { controller, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((icon: string | null) => {
        closeDialog();
        if (icon !== null) {
            if (controller?.isCaret()) {
                controller?.insertNode(new FlowIcon({
                    data: icon,
                    style: controller.getCaretStyle(),
                }));
            } else {
                controller?.setIcon(icon);
            }
        }
    }, [controller, closeDialog]);
    const disabled = useMemo(() => {
        if (!controller) {
            return false;
        } else if (controller.isCaret()) {
            return false;
        } else if (controller.isIcon()) {
            return false;
        } else {
            return true;
        }
    }, [controller]);
    const active = useMemo(() => controller?.isIcon(), [controller]);
    const initialValue = useMemo(() => controller?.getIcon() ?? "", [controller]);
    const locale = useMaterialFlowLocale();
    return (
        <>
            <ToolButton
                {...rest} 
                onClick={openDialog}
                disabled={disabled}
                active={active}
                children={<Icon size={1} path={mdiCreation}/>}
            />
            <IconDialog
                open={isDialogOpen}
                initialValue={initialValue}
                onClose={closeDialog}
                onComplete={completeDialog}
                completeLabel={active ? locale.button_apply : locale.button_insert}
            />
        </>
    );
};
