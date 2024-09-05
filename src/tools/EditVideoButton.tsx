import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import Icon from "@mdi/react";
import { mdiMovieEdit, mdiMoviePlus } from "@mdi/js";
import { MenuItem } from "@material-ui/core";
import { MenuButton } from "../components/MenuButton";
import { InsertVideo } from "../commands/InsertVideo";
import { FlowVideo } from "scribing";
import { MediaScaleDialog } from "../components/MediaScaleDialog";

export interface EditVideoButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
}

export const EditVideoButton: FC<EditVideoButtonProps> = props => {
    const { controller, frozen, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const disabled = useMemo(() => frozen || !controller || !controller?.isVideo(), [frozen, controller]);
    const [editingScale, setEditingScale] = useState(false);
    const videoNode = useMemo<FlowVideo | null | undefined>(() => {
        let single: FlowVideo | null | undefined;
        controller?.forEachNode(node => {
            if (single === undefined) {
                single = node instanceof FlowVideo ? node : null;
            }
        });
        return single;
    }, [controller]);
    const active = !!controller?.isVideo();
    const onChangeSource = useCallback(() => controller && InsertVideo.exec(controller), [controller]);
    const onResetScale = useCallback(() => controller && controller.setVideoScale(1), [controller]);
    const onEditScale = useCallback(() => setEditingScale(true), [setEditingScale]);
    const onCloseDialog = useCallback(() => setEditingScale(false), [setEditingScale]);
    const onApplyScale = useCallback((value: number) => {
        if (controller) {
            setEditingScale(false);
            controller.setVideoScale(value);
        }
    }, [controller, setEditingScale]);
    return (
        <>
            <MenuButton
                {...rest}
                disabled={disabled}
                active={active}
                title={active ? locale.tip_change_video : locale.tip_insert_video}
                children={<Icon size={1} path={active ? mdiMovieEdit : mdiMoviePlus}/>}
                menu={(
                    <>
                        <MenuItem onClick={onChangeSource}>{locale.label_change_source}&hellip;</MenuItem>
                        <MenuItem onClick={onEditScale} disabled={!videoNode}>
                            {locale.label_edit_scale}&hellip;
                        </MenuItem>
                        <MenuItem onClick={onResetScale}>{locale.label_reset_scale}</MenuItem>
                    </>
                )}
            />
            {editingScale && videoNode && (
                <MediaScaleDialog open node={videoNode} onClose={onCloseDialog} onApply={onApplyScale} />
            )}
        </>
    );
};
