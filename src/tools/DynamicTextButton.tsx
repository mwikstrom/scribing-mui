import { mdiFunctionVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { DynamicText } from "scribing";
import { FlowEditorController } from "scribing-react";
import { ScriptEditorDialog } from "../components/ScriptEditorDialog";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface DynamicTextButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const DynamicTextButton: FC<DynamicTextButtonProps> = props => {
    const { controller, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((script: string | null) => {
        closeDialog();
        if (script !== null) {
            controller?.insertNode(new DynamicText({
                expression: script,
                style: controller.getCaretStyle(),
            }));
        }
    }, [controller, closeDialog]);
    const disabled = useMemo(() => {
        if (!controller) {
            return false;
        } else if (controller.isCaret()) {
            return false;
        } else if (controller.isDynamicText()) {
            return false;
        } else {
            return true;
        }
    }, [controller]);
    const active = useMemo(() => controller?.isDynamicText(), [controller]);
    const initialValue = useMemo(() => controller?.getDynamicTextExpression() ?? "", [controller]);
    return (
        <>
            <ToolButton
                {...rest} 
                onClick={openDialog}
                disabled={disabled}
                active={active}
                children={<Icon size={1} path={mdiFunctionVariant}/>}
            />
            <ScriptEditorDialog
                open={isDialogOpen}
                initialValue={initialValue}
                onClose={closeDialog}
                onComplete={completeDialog}
            />
        </>
    );
};
