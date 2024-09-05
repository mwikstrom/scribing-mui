import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { FlowEditorController, createVideoSourceFromUrl } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import Icon from "@mdi/react";
import { mdiMoviePlus } from "@mdi/js";
import { MenuItem } from "@material-ui/core";
import { MenuButton } from "../components/MenuButton";
import { InsertVideo } from "../commands/InsertVideo";
import { FlowVideo } from "scribing";

export interface InsertVideoButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
    renderVideoSelector: (callback: (sourceUrl: string | null, posterUrl?: string | null) => void) => ReactNode;
}

export const InsertVideoButton: FC<InsertVideoButtonProps> = props => {
    const { controller, frozen, renderVideoSelector, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const [showVideoSelector, setShowVideoSelector] = useState(false);
    const disabled = useMemo(() => frozen || !controller, [frozen, controller]);
    const onInsertFromFile = useCallback(() => controller && InsertVideo.exec(controller), [controller]);
    const onInsertFromMediaLibrary = useCallback(() => setShowVideoSelector(true), [setShowVideoSelector]);
    const onCloseVideoSelector = useCallback(async (sourceUrl: string | null, posterUrl?: string | null) => {
        setShowVideoSelector(false);
        if (sourceUrl && controller) {
            const source = await createVideoSourceFromUrl(sourceUrl, posterUrl);
            controller.insertNode(new FlowVideo({ source, style: controller.getCaretStyle(), scale: 1 }));
        }
    }, [controller]);
    return (
        <>
            <MenuButton
                {...rest}
                disabled={disabled}
                title={locale.tip_insert_video}
                children={<Icon size={1} path={mdiMoviePlus}/>}
                menu={(
                    <>
                        <MenuItem onClick={onInsertFromFile}>{locale.label_insert_from_file}&hellip;</MenuItem>
                        <MenuItem onClick={onInsertFromMediaLibrary}>
                            {locale.label_insert_from_media_library}&hellip;
                        </MenuItem>
                    </>
                )}
            />
            {showVideoSelector && renderVideoSelector(onCloseVideoSelector)}
        </>
    );
};
