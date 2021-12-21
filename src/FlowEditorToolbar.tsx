import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { Collapse, IconButton, Theme, Toolbar } from "@material-ui/core";
import Icon from "@mdi/react";
import { 
    mdiFormatLineSpacing, 
    mdiFormatSize, 
    mdiMenuDown, 
    mdiMenuUp, 
    mdiSpellcheck,
    mdiTranslate,
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
}

// TODO: FIX CUT/COPY/PASTE

/** @public */
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = props => {
    const { controller, className, source, frozen, onCheckIn, onCheckOut, onReset } = props;
    const isPreview = useMemo(() => controller?.getPreview(), [controller]);
    const isBoxSelection = useMemo(() => controller?.isBox(), [controller]);
    const isTableSelection = useMemo(() => controller?.isTableSelection(), [controller]);
    const [isExpanded, setExpanded] = useState(false);
    const [toolsRef, setToolsRef] = useState<HTMLElement | null>(null);
    const toolsSize = useElementSize(toolsRef);
    const theme = useTheme<Theme>();
    const collapsedSize = theme.spacing(6);
    const isWrapped = useMemo(() => {
        if (toolsRef) {
            for (
                let child = toolsRef.firstElementChild as (HTMLElement | null); 
                child !== null; 
                child = child.nextElementSibling as (HTMLElement | null)
            ) {
                if (child.offsetTop >= collapsedSize) {
                    return true;
                }
            }
        }
        return false;
    }, [toolsSize, controller, toolsRef, collapsedSize]);
    const toggleExpanded = useCallback(() => setExpanded(before => !before), []);
    const classes = useStyles();
    const checkInOutProps = { source, onCheckIn, onCheckOut, };
    const toolProps = { controller, frozen };
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
                                <TextColorButton {...toolProps}/>
                                <FontFamilyButton {...toolProps}/>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiFormatSize}/>
                                </ToolButton>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiFormatLineSpacing}/>
                                </ToolButton>
                            </ToolGroup>
                            <ToolGroup collapse={isBoxSelection}>
                                <CommandButton {...toolProps} command={ToggleBold}/>
                                <CommandButton {...toolProps} command={ToggleItalic}/>
                                <CommandButton {...toolProps} command={ToggleUnderline}/>
                                <CommandButton {...toolProps} command={ToggleStrikeThrough}/>
                                <InteractionButton {...toolProps}/>
                                <CommandButton {...toolProps} command={ToggleSubscript}/>
                                <CommandButton {...toolProps} command={ToggleSuperscript}/>
                            </ToolGroup>
                            <ToolGroup collapse={!isBoxSelection}>
                                <BoxVariantSelector {...toolProps}/>
                                <BoxColorButton {...toolProps}/>
                                <CommandButton {...toolProps} command={ToggleFullWidthBox}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={AlignLeft}/>
                                <CommandButton {...toolProps} command={AlignCenter}/>
                                <CommandButton {...toolProps} command={AlignRight}/>
                                <CommandButton {...toolProps} command={AlignJustify}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={ToggleUnorderedList}/>
                                <CommandButton {...toolProps} command={ToggleOrderedList}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={DecrementIndent}/>
                                <CommandButton {...toolProps} command={IncrementIndent}/>
                            </ToolGroup>
                            <ToolGroup collapse={isTableSelection}>
                                <DynamicTextButton {...toolProps}/>
                                <CommandButton {...toolProps} command={InsertBox}/>
                                <FlowIconButton {...toolProps}/>
                                <CommandButton {...toolProps} command={InsertImage}/>
                                <InsertTableButton {...toolProps}/>
                                <MarkupButton {...toolProps}/>
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton {...toolProps} command={InsertTableRowBefore}/>
                                <CommandButton {...toolProps} command={InsertTableRowAfter}/>
                                <CommandButton {...toolProps} command={InsertTableColumnBefore}/>
                                <CommandButton {...toolProps} command={InsertTableColumnAfter}/>
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton {...toolProps} command={RemoveTableRow}/>
                                <CommandButton {...toolProps} command={RemoveTableColumn}/>
                            </ToolGroup>
                            <ToolGroup collapse={!isTableSelection}>
                                <CommandButton {...toolProps} command={MergeTableCells}/>
                                <CommandButton {...toolProps} command={SplitTableCell}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={Undo}/>
                                <CommandButton {...toolProps} command={Redo}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={Copy}/>
                                <CommandButton {...toolProps} command={Cut}/>
                                <CommandButton {...toolProps} command={Paste}/>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={ReadingLtr}/>
                                <CommandButton {...toolProps} command={ReadingRtl}/>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiSpellcheck}/>
                                </ToolButton>
                                <ToolButton disabled>
                                    <Icon size={1} path={mdiTranslate}/>
                                </ToolButton>
                            </ToolGroup>
                            <ToolGroup>
                                <CommandButton {...toolProps} command={ToggleFormattingMarks}/>
                                <CommandButton {...toolProps} command={TogglePreview}/>
                                <CheckInOutButton {...checkInOutProps}/>
                            </ToolGroup>
                        </>
                    )}
                </Toolbar>
            </Collapse>
            {isWrapped && (
                <IconButton className={classes.expandButton} onClick={toggleExpanded}>
                    <Icon size={1} path={isExpanded ? mdiMenuUp : mdiMenuDown}/>
                </IconButton>  
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
