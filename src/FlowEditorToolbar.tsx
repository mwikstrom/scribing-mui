import React, { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { Collapse, IconButton, Theme, Toolbar, Tooltip, useMediaQuery } from "@material-ui/core";
import Icon from "@mdi/react";
import { 
    mdiFormatLineSpacing, 
    mdiFormatSize, 
    mdiMenuDown, 
    mdiMenuUp, 
    mdiSpellcheck,
} from "@mdi/js";
import { makeStyles, useTheme } from "@material-ui/styles";
import { ToolGroup } from "./components/ToolGroup";
import { ToolButton } from "./components/ToolButton";
import { CommandButton } from "./tools/CommandButton";
import { ToggleBold } from "./commands/ToggleBold";
import { ToggleItalic } from "./commands/ToggleItalic";
import { ToggleUnderline } from "./commands/ToggleUnderline";
import { ToggleStrikeThrough } from "./commands/ToggleStrikeThrough";
import { ToggleSubscript } from "./commands/ToggleSubscript";
import { ToggleSuperscript } from "./commands/ToggleSuperscript";
import { Undo } from "./commands/Undo";
import { Redo } from "./commands/Redo";
import { Copy } from "./commands/Copy";
import { Cut } from "./commands/Cut";
import { Paste } from "./commands/Paste";
import { AlignLeft } from "./commands/AlignLeft";
import { AlignJustify } from "./commands/AlignJustify";
import { AlignRight } from "./commands/AlignRight";
import { AlignCenter } from "./commands/AlignCenter";
import { ReadingLtr } from "./commands/ReadingLtr";
import { ReadingRtl } from "./commands/ReadingRtl";
import { ToggleFormattingMarks } from "./commands/ToggleFormattingMarks";
import { ToggleUnorderedList } from "./commands/ToggleUnorderedList";
import { ToggleOrderedList } from "./commands/ToggleOrderedList";
import { IncrementIndent } from "./commands/IncrementIndent";
import { DecrementIndent } from "./commands/DecrementIndent";
import { ParagraphVariantSelector } from "./tools/ParagraphVariantSelector";
import { TextColorButton } from "./tools/TextColorButton";
import { FontFamilyButton } from "./tools/FontFamilyButton";
import clsx from "clsx";
import { InsertBox } from "./commands/InsertBox";
import { BoxVariantSelector } from "./tools/BoxVariantSelector";
import { BoxColorButton } from "./tools/BoxColorButton";
import { ToggleFullWidthBox } from "./commands/ToggleFullWidthBox";
import { InsertImage } from "./commands/InsertImage";
import { InsertTableButton } from "./tools/InsertTableButton";
import { MergeTableCells } from "./commands/MergeTableCells";
import { SplitTableCell } from "./commands/SplitTableCell";
import { InsertTableColumnAfter } from "./commands/InsertTableColumnAfter";
import { InsertTableColumnBefore } from "./commands/InsertTableColumnBefore";
import { InsertTableRowAfter } from "./commands/InsertTableRowAfter";
import { InsertTableRowBefore } from "./commands/InsertTableRowBefore";
import { RemoveTableRow } from "./commands/RemoveTableRow";
import { RemoveTableColumn } from "./commands/RemoveTableColumn";
import { DynamicTextButton } from "./tools/DynamicTextButton";
import { FlowIconButton } from "./tools/FlowIconButton";
import { InteractionButton } from "./tools/InteractionButton";
import { MarkupButton } from "./tools/MarkupButton";
import { useElementSize } from "./hooks/use-element-size";
import { TogglePreview } from "./commands/TogglePreview";
import { ExitPreviewButton } from "./components/ExitPreviewButton";
import { CheckInOutButton } from "./components/CheckInOutButton";
import { ConnectionBroken } from "./components/ConnectionBroken";
import { Interaction } from "scribing";
import { MarkupUpdateInfo, useMaterialFlowLocale } from ".";
import { BoxSourceButton } from "./tools/BoxSourceButton";
import { MarkupInfo } from "./MarkupInfo";
import { EditImageButton } from "./tools/EditImageButton";
import { InteractionOptionResult } from "./InteractionOptionResult";
import { InsertImageButton } from "./tools/InsertImageButton";

/** @public */
export type EditorSourceState = (
    "none" |
    "busy" |
    "checked-out" |
    "checked-in" |
    "broken"
);

/** @public */
export interface FlowEditorToolbarProps {
    controller?: FlowEditorController | null;
    className?: string;
    source?: EditorSourceState;
    frozen?: boolean;
    onCheckIn?: () => void;
    onCheckOut?: () => void;
    onReset?: () => void;
    getCustomInteractionOptions?: CustomOptionProvider<Interaction | null, InteractionOptionResult>;
    getCustomMarkupOptions?: CustomOptionProvider<MarkupInfo | null, MarkupUpdateInfo>;
    renderImageSelector?: (callback: (sourceUrl: string | null) => void) => ReactNode;
}

/** @public */
export type CustomOptionProvider<T, U = T> = (
    current: T
) => readonly CustomOption<T, U>[];

/** @public */
export interface CustomOption<T, U = T> {
    key: string;
    label: string;
    selected: boolean;
    getResult?: (current: T) => U | undefined;
    renderDialog?: (
        current: T,
        onClose: (result: U | undefined) => void,
        onApply: (update: U) => void,
    ) => ReactNode;
}

// TODO: FIX CUT/COPY/PASTE

/** @public */
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = props => {
    const {
        controller,
        className,
        source,
        frozen,
        onCheckIn,
        onCheckOut,
        onReset,
        getCustomInteractionOptions,
        getCustomMarkupOptions,
        renderImageSelector,
    } = props;
    const isPreview = useMemo(() => controller?.getPreview(), [controller]);
    const isBoxSelection = useMemo(() => controller?.isBox(), [controller]);
    const isImageSelection = useMemo(() => controller?.isImage(), [controller]);
    const isTableSelection = useMemo(() => controller?.isTableSelection(), [controller]);
    const [isExpanded, setExpanded] = useState(false);
    const [toolsRef, setToolsRef] = useState<HTMLElement | null>(null);
    const toolsSize = useElementSize(toolsRef);
    const theme = useTheme<Theme>();
    const isHighWindow = useMediaQuery("(min-height: 600px)");
    const lineSize = theme.spacing(6);
    const maxOffset = useMemo(() => {
        let result = 0;
        if (toolsRef) {
            for (
                let child = toolsRef.firstElementChild as (HTMLElement | null); 
                child !== null; 
                child = child.nextElementSibling as (HTMLElement | null)
            ) {
                result = Math.max(result, child.offsetTop);
            }
        }
        return result;
    }, [toolsSize, controller, toolsRef]);
    const desiredLineCount = 1 + Math.round(maxOffset / lineSize);
    const collapsedSize = lineSize * Math.min(desiredLineCount, isHighWindow ? 2 : 1);
    const toggleExpanded = useCallback(() => setExpanded(before => !before), []);
    const classes = useStyles();
    const checkInOutProps = { source, onCheckIn, onCheckOut, };
    const toolProps = { controller, frozen };
    const locale = useMaterialFlowLocale();
    return (
        <div className={clsx(classes.root, className)}>
            <Collapse in={isExpanded || source === "broken"} collapsedSize={collapsedSize}>
                <Toolbar className={classes.tools} ref={setToolsRef} disableGutters>
                    {source === "broken" ? (
                        <ConnectionBroken onReset={onReset}/>
                    ) : isPreview ? (
                        <>
                            <ToolGroup>
                                <ExitPreviewButton {...toolProps}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CheckInOutButton {...checkInOutProps} showLabel primary/>
                            </ToolGroup>
                        </>
                    ) : (
                        <>
                            <ToolGroup collapse={isBoxSelection}>
                                <ParagraphVariantSelector {...toolProps}/>
                                <TextColorButton {...toolProps} title={locale.tip_text_color}/>
                                <FontFamilyButton {...toolProps} title={locale.tip_font_family}/>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiFormatSize}/>
                                </ToolButton>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiFormatLineSpacing}/>
                                </ToolButton>
                            </ToolGroup>
                            <ToolGroup collapse={isBoxSelection}>
                                <CommandButton {...toolProps} command={ToggleBold} title={locale.tip_bold}/>
                                <CommandButton {...toolProps} command={ToggleItalic} title={locale.tip_italic}/>
                                <CommandButton {...toolProps} command={ToggleUnderline} title={locale.tip_underline}/>
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleStrikeThrough}
                                    title={locale.tip_strikethrough}
                                />
                                <InteractionButton
                                    {...toolProps}
                                    getCustomInteractionOptions={getCustomInteractionOptions}
                                    title={locale.tip_link_interaction}
                                />
                                <CommandButton {...toolProps} command={ToggleSubscript} title={locale.tip_subscript}/>
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleSuperscript}
                                    title={locale.tip_superscript}
                                />
                            </ToolGroup>
                            <ToolGroup collapse={!isBoxSelection}>
                                <BoxVariantSelector {...toolProps}/>
                                <BoxColorButton {...toolProps} title={locale.tip_box_color}/>
                                <InteractionButton
                                    {...toolProps}
                                    getCustomInteractionOptions={getCustomInteractionOptions}
                                    title={locale.tip_box_interaction}
                                />
                                <BoxSourceButton {...toolProps} title={locale.tip_data_source}/>
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleFullWidthBox}
                                    title={locale.tip_box_full_width}
                                />
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={AlignLeft} title={locale.tip_align_left}/>
                                <CommandButton {...toolProps} command={AlignCenter} title={locale.tip_align_center}/>
                                <CommandButton {...toolProps} command={AlignRight} title={locale.tip_align_right}/>
                                <CommandButton {...toolProps} command={AlignJustify} title={locale.tip_align_justify}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleUnorderedList}
                                    title={locale.tip_list_unordered}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleOrderedList}
                                    title={locale.tip_list_ordered}
                                />
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton
                                    {...toolProps}
                                    command={DecrementIndent}
                                    title={locale.tip_indent_decrement}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={IncrementIndent}
                                    title={locale.tip_indent_increment}
                                />
                            </ToolGroup>
                            <ToolGroup collapse={isTableSelection}>
                                {!isBoxSelection && (
                                    <DynamicTextButton {...toolProps} title={locale.tip_dynamic_text}/>
                                )}
                                <CommandButton {...toolProps} command={InsertBox} title={locale.tip_insert_box}/>
                                <FlowIconButton {...toolProps} title={locale.tip_icon}/>
                                {isImageSelection ? (
                                    <EditImageButton {...toolProps}/>
                                ) : renderImageSelector ? (
                                    <InsertImageButton {...toolProps} renderImageSelector={renderImageSelector} />
                                ) : (
                                    <CommandButton
                                        {...toolProps}
                                        command={InsertImage}
                                        title={locale.tip_insert_image}
                                    />
                                )}
                                <InsertTableButton {...toolProps} title={locale.tip_insert_table}/>
                                <MarkupButton
                                    {...toolProps}
                                    title={locale.tip_markup}
                                    getCustomMarkupOptions={getCustomMarkupOptions}
                                />
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton
                                    {...toolProps}
                                    command={InsertTableRowBefore}
                                    title={locale.tip_table_row_insert_before}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={InsertTableRowAfter}
                                    title={locale.tip_table_row_insert_after}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={InsertTableColumnBefore}
                                    title={locale.tip_table_column_insert_before}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={InsertTableColumnAfter}
                                    title={locale.tip_table_column_insert_after}
                                />
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton
                                    {...toolProps}
                                    command={RemoveTableRow}
                                    title={locale.tip_table_row_remove}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={RemoveTableColumn}
                                    title={locale.tip_table_column_remove}
                                />
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton
                                    {...toolProps}
                                    command={MergeTableCells}
                                    title={locale.tip_table_merge_cells}
                                />
                                <CommandButton
                                    {...toolProps}
                                    command={SplitTableCell}
                                    title={locale.tip_table_split_cell}
                                />
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={Undo} title={locale.tip_undo}/>
                                <CommandButton {...toolProps} command={Redo} title={locale.tip_redo}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={Copy} title={locale.tip_copy}/>
                                <CommandButton {...toolProps} command={Cut} title={locale.tip_cut}/>
                                <CommandButton {...toolProps} command={Paste} title={locale.tip_paste}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={ReadingLtr} title={locale.tip_reading_ltr}/>
                                <CommandButton {...toolProps} command={ReadingRtl} title={locale.tip_reading_rtl}/>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiSpellcheck}/>
                                </ToolButton>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton
                                    {...toolProps}
                                    command={ToggleFormattingMarks}
                                    title={locale.tip_formatting_marks}
                                />
                                <CommandButton {...toolProps} command={TogglePreview} title={locale.tip_preview}/>
                                <CheckInOutButton {...checkInOutProps} title={locale.tip_check_in}/>
                            </ToolGroup>
                        </>
                    )}
                </Toolbar>
            </Collapse>
            {maxOffset >= collapsedSize && (
                <Tooltip arrow interactive placement="bottom" title={locale.tip_more_tools}>
                    <IconButton className={classes.expandButton} onClick={toggleExpanded}>
                        <Icon size={1} path={isExpanded ? mdiMenuUp : mdiMenuDown}/>
                    </IconButton>
                </Tooltip>  
            )}                  
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "row",
    },
    tools: {
        minHeight: theme.spacing(6),
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "inherit",
    },
    expandButton: {
        flex: 0,
        alignSelf: "end",
    },
}));
