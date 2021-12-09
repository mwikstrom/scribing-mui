import { mdiCodeTags } from "@mdi/js";
import { Icon } from "@mdi/react";
import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import { ToolButton, ToolButtonProps } from "../components/ToolButton";
import { TextFieldDialog } from "../components/TextFieldDialog";

export interface MarkupButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
}

export const MarkupButton: FC<MarkupButtonProps> = props => {
    const { controller, ...rest } = props;
    const [isDialogOpen, setDialogOpen] = useState(false);
    const openDialog = useCallback(() => setDialogOpen(true), []);
    const closeDialog = useCallback(() => setDialogOpen(false), []);    
    const completeDialog = useCallback((tag: string | null) => {
        closeDialog();
        if (tag) {
            controller?.insertMarkup(tag);
        }
    }, [controller, closeDialog]);
    const disabled = useMemo(() => !controller || controller?.isTableSelection(), [controller]);
    const locale = useMaterialFlowLocale();
    return (
        <>
            <ToolButton
                {...rest} 
                onClick={openDialog}
                disabled={disabled}
                children={<Icon size={1} path={mdiCodeTags}/>}
            />
            <TextFieldDialog
                open={isDialogOpen}
                onClose={closeDialog}
                onComplete={completeDialog}
                inputLabel={locale.label_markup_tag}
                completeLabel={locale.button_insert}
            />
        </>
    );
};
