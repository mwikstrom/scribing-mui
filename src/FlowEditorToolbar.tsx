import React, { FC, useCallback, useMemo, useState } from "react";
import { FlowEditorController } from "scribing-react";
import { Collapse, IconButton, Theme, Toolbar } from "@material-ui/core";
import Icon from "@mdi/react";
import { 
    mdiEyeCheck,
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

/** @public */
export interface FlowEditorToolbarProps {
    controller?: FlowEditorController | null;
    className?: string;
}

// TODO: Flow typography
// TODO: Insert component
// TODO: FIX CUT/COPY/PASTE
// TODO: Check-in?
// TODO: Connection status?

/** @public */
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = props => {
    const { controller, className } = props;
    const isBoxSelection = useMemo(() => controller?.isBox(), [controller]);
    const isTableSelection = useMemo(() => controller?.isTableSelection(), [controller]);
    const [isExpanded, setExpanded] = useState(false);
    const [toolsRef, setToolsRef] = useState<HTMLElement | null>(null);
    const toolsSize = useElementSize(toolsRef);
    const theme = useTheme<Theme>();
    const collapsedSize = theme.spacing(6);
    const isWrapped = useMemo(() => {
        console.log("CHECKING");
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
    return (
        <Collapse in={isExpanded} collapsedSize={collapsedSize}>
            <Toolbar className={clsx(classes.root, className)} disableGutters>
                <div className={classes.tools} ref={setToolsRef}>
                    <ToolGroup collapse={isBoxSelection}>
                        <ParagraphVariantSelector controller={controller}/>
                        <TextColorButton controller={controller}/>
                        <FontFamilyButton controller={controller}/>
                        <ToolButton disabled>
                            <Icon size={1} path={mdiFormatSize}/>
                        </ToolButton>
                        <ToolButton disabled>
                            <Icon size={1} path={mdiFormatLineSpacing}/>
                        </ToolButton>
                    </ToolGroup>
                    <ToolGroup collapse={isBoxSelection}>
                        <CommandButton controller={controller} command={ToggleBold}/>
                        <CommandButton controller={controller} command={ToggleItalic}/>
                        <CommandButton controller={controller} command={ToggleUnderline}/>
                        <CommandButton controller={controller} command={ToggleStrikeThrough}/>
                        <InteractionButton controller={controller}/>
                        <CommandButton controller={controller} command={ToggleSubscript}/>
                        <CommandButton controller={controller} command={ToggleSuperscript}/>
                    </ToolGroup>
                    <ToolGroup collapse={!isBoxSelection}>
                        <BoxVariantSelector controller={controller}/>
                        <BoxColorButton controller={controller}/>
                        <CommandButton controller={controller} command={ToggleFullWidthBox}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={AlignLeft}/>
                        <CommandButton controller={controller} command={AlignCenter}/>
                        <CommandButton controller={controller} command={AlignRight}/>
                        <CommandButton controller={controller} command={AlignJustify}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={ToggleUnorderedList}/>
                        <CommandButton controller={controller} command={ToggleOrderedList}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={DecrementIndent}/>
                        <CommandButton controller={controller} command={IncrementIndent}/>
                    </ToolGroup>
                    <ToolGroup collapse={isTableSelection}>
                        <DynamicTextButton controller={controller}/>
                        <CommandButton controller={controller} command={InsertBox}/>
                        <FlowIconButton controller={controller}/>
                        <CommandButton controller={controller} command={InsertImage}/>
                        <InsertTableButton controller={controller}/>
                        <MarkupButton controller={controller}/>
                    </ToolGroup>
                    <ToolGroup collapse={!isTableSelection}>
                        <CommandButton controller={controller} command={InsertTableRowBefore}/>
                        <CommandButton controller={controller} command={InsertTableRowAfter}/>
                        <CommandButton controller={controller} command={InsertTableColumnBefore}/>
                        <CommandButton controller={controller} command={InsertTableColumnAfter}/>
                    </ToolGroup>
                    <ToolGroup collapse={!isTableSelection}>
                        <CommandButton controller={controller} command={RemoveTableRow}/>
                        <CommandButton controller={controller} command={RemoveTableColumn}/>
                    </ToolGroup>
                    <ToolGroup collapse={!isTableSelection}>
                        <CommandButton controller={controller} command={MergeTableCells}/>
                        <CommandButton controller={controller} command={SplitTableCell}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={Undo}/>
                        <CommandButton controller={controller} command={Redo}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={Copy}/>
                        <CommandButton controller={controller} command={Cut}/>
                        <CommandButton controller={controller} command={Paste}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={ReadingLtr}/>
                        <CommandButton controller={controller} command={ReadingRtl}/>
                        <ToolButton disabled>
                            <Icon size={1} path={mdiSpellcheck}/>
                        </ToolButton>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={ToggleFormattingMarks}/>
                        <ToolButton disabled>
                            <Icon size={1} path={mdiEyeCheck}/>
                        </ToolButton>
                    </ToolGroup>
                </div>
                {isWrapped && (
                    <IconButton className={classes.expandButton} onClick={toggleExpanded}>
                        <Icon size={1} path={isExpanded ? mdiMenuUp : mdiMenuDown}/>
                    </IconButton>  
                )}                  
            </Toolbar>
        </Collapse>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        minHeight: theme.spacing(6),
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    tools: {
        flex: 1,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "inherit",
    },
    expandButton: {
        flex: 0,
        alignSelf: "start",
    },
}));
