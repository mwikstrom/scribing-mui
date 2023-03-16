import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import Icon from "@mdi/react";
import { mdiImageEdit, mdiImagePlus } from "@mdi/js";
import { MenuItem } from "@material-ui/core";
import { MenuButton } from "../components/MenuButton";
import { InsertImage } from "../commands/InsertImage";
import { FlowImage } from "scribing";
import { ImageScaleDialog } from "../components/ImageScaleDialog";

export interface EditImageButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const EditImageButton: FC<EditImageButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const disabled = useMemo(() => frozen || !controller || !controller?.isImage(), [frozen, controller]);
    const [editingScale, setEditingScale] = useState(false);
    const imageNode = useMemo<FlowImage | null | undefined>(() => {
        let single: FlowImage | null | undefined;
        controller?.forEachNode(node => {
            if (single === undefined) {
                single = node instanceof FlowImage ? node : null;
            }
        });
        return single;
    }, [controller]);
    const active = !!controller?.isImage();
    const onChangeSource = useCallback(() => controller && InsertImage.exec(controller), [controller]);
    const onResetScale = useCallback(() => controller && controller.setImageScale(1), [controller]);
    const onEditScale = useCallback(() => setEditingScale(true), [setEditingScale]);
    const onCloseDialog = useCallback(() => setEditingScale(false), [setEditingScale]);
    const onApplyScale = useCallback((value: number) => {
        if (controller) {
            setEditingScale(false);
            controller.setImageScale(value);
        }
    }, [controller, setEditingScale]);
    return (
        <>
            <MenuButton
                {...rest}
                disabled={disabled}
                active={active}
                title={active ? locale.tip_change_image : locale.tip_insert_image}
                children={<Icon size={1} path={active ? mdiImageEdit : mdiImagePlus}/>}
                menu={(
                    <>
                        <MenuItem onClick={onChangeSource}>{locale.label_change_source}&hellip;</MenuItem>
                        <MenuItem onClick={onEditScale} disabled={!imageNode}>
                            {locale.label_edit_scale}&hellip;
                        </MenuItem>
                        <MenuItem onClick={onResetScale}>{locale.label_reset_scale}</MenuItem>
                    </>
                )}
            />
            {editingScale && imageNode && (
                <ImageScaleDialog open image={imageNode} onClose={onCloseDialog} onApply={onApplyScale} />
            )}
        </>
    );
};
