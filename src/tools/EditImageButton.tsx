import React, { FC, useCallback, useMemo } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import Icon from "@mdi/react";
import { mdiImagePlus } from "@mdi/js";
import { MenuItem } from "@material-ui/core";
import { MenuButton } from "../components/MenuButton";
import { InsertImage } from "../commands/InsertImage";

export interface EditImageButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const EditImageButton: FC<EditImageButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const disabled = useMemo(() => frozen || !controller || !controller?.isImage(), [frozen, controller]);
    const active = !!controller?.isImage();
    const onChangeSource = useCallback(() => controller && InsertImage.exec(controller), [controller]);
    const onResetScale = useCallback(() => controller && controller.setImageScale(1), [controller]);
    return (
        <MenuButton
            {...rest}
            disabled={disabled}
            active={active}
            title={locale.tip_insert_image}
            children={<Icon size={1} path={mdiImagePlus}/>}
            menu={
                <>
                    <MenuItem onClick={onChangeSource}>{locale.label_change_source}&hellip;</MenuItem>
                    <MenuItem onClick={onResetScale}>{locale.label_reset_scale}</MenuItem>
                </>
            }
        />
    );
};