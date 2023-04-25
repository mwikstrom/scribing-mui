import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { FlowEditorController, createImageSource } from "scribing-react";
import { ToolButtonProps } from "../components/ToolButton";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";
import Icon from "@mdi/react";
import { mdiImagePlus } from "@mdi/js";
import { MenuItem } from "@material-ui/core";
import { MenuButton } from "../components/MenuButton";
import { InsertImage } from "../commands/InsertImage";
import { FlowImage } from "scribing";

export interface InsertImageButtonProps extends ToolButtonProps {
    controller?: FlowEditorController | null;
    frozen?: boolean;
    renderImageSelector: (callback: (sourceUrl: string | null) => void) => ReactNode;
}

export const InsertImageButton: FC<InsertImageButtonProps> = props => {
    const { controller, frozen, renderImageSelector, ...rest } = props;
    const locale = useMaterialFlowLocale();
    const [showImageSelector, setShowImageSelector] = useState(false);
    const disabled = useMemo(() => frozen || !controller, [frozen, controller]);
    const onInsertFromFile = useCallback(() => controller && InsertImage.exec(controller), [controller]);
    const onInsertFromMediaLibrary = useCallback(() => setShowImageSelector(true), [setShowImageSelector]);
    const onCloseImageSelector = useCallback(async (sourceUrl: string | null) => {
        setShowImageSelector(false);
        if (sourceUrl && controller) {
            const source = await createImageSource(sourceUrl);
            controller.insertNode(new FlowImage({ source, style: controller.getCaretStyle(), scale: 1 }));
        }
    }, [controller]);
    return (
        <>
            <MenuButton
                {...rest}
                disabled={disabled}
                title={locale.tip_insert_image}
                children={<Icon size={1} path={mdiImagePlus}/>}
                menu={(
                    <>
                        <MenuItem onClick={onInsertFromFile}>{locale.label_insert_from_file}&hellip;</MenuItem>
                        <MenuItem onClick={onInsertFromMediaLibrary}>
                            {locale.label_insert_from_media_library}&hellip;
                        </MenuItem>
                    </>
                )}
            />
            {showImageSelector && renderImageSelector(onCloseImageSelector)}
        </>
    );
};
