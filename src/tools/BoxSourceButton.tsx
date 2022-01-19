import { mdiFunctionVariant } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ScriptEditorDialog } from "../components/ScriptEditorDialog";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";

export interface BoxSourceButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const BoxSourceButton: FC<BoxSourceButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((script: string | null) => {
        closeDialog();
        controller?.formatBox("source", script ? script : null);
    }, [controller, closeDialog]);
    const disabled = useMemo(() => {
        if (!controller || frozen) {
            return true;
        } else {
            return !controller.isBox();
        }
    }, [frozen, controller]);
    const initialValue = useMemo(() => controller?.getBoxStyle()?.source ?? "", [controller]);
    const active = !!initialValue;
    const locale = useMaterialFlowLocale();
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
                scriptLabel={locale.label_data_source}
                completeLabel={locale.button_apply}
            />
        </>
    );
};
