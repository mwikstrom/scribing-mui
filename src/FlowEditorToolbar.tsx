import React, { FC, useMemo } from "react";
import { FlowEditorController } from "scribing-react";
import { Toolbar } from "@material-ui/core";
import Icon from "@mdi/react";
import { 
    mdiCodeTags,
    mdiCreation,
    mdiEyeCheck,
    mdiFormatLineSpacing, 
    mdiFormatSize, 
    mdiGestureTapButton,
    mdiSpellcheck,
} from "@mdi/js";
import { makeStyles } from "@material-ui/styles";
import { ToolGroup } from "./tools/ToolGroup";
import { ToolButton } from "./tools/ToolButton";
import { CommandButton } from "./commands/CommandButton";
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
import { BoxVariantSelector } from "./commands/BoxVariantSelector";
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
    const classes = useStyles();
    return (
        <Toolbar className={clsx(classes.root, className)} disableGutters>
            <ToolGroup>
                <CommandButton controller={controller} command={Undo}/>
                <CommandButton controller={controller} command={Redo}/>
            </ToolGroup>
            <ToolGroup>
                <CommandButton controller={controller} command={Copy}/>
                <CommandButton controller={controller} command={Cut}/>
                <CommandButton controller={controller} command={Paste}/>
            </ToolGroup>
            {!isBoxSelection && (
                <>
                    <ToolGroup>
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
                    <ToolGroup>
                        <CommandButton controller={controller} command={ToggleBold}/>
                        <CommandButton controller={controller} command={ToggleItalic}/>
                        <CommandButton controller={controller} command={ToggleUnderline}/>
                        <CommandButton controller={controller} command={ToggleStrikeThrough}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={ToggleSubscript}/>
                        <CommandButton controller={controller} command={ToggleSuperscript}/>
                    </ToolGroup>
                </>
            )}
            {isBoxSelection && (
                <ToolGroup>
                    <BoxVariantSelector controller={controller}/>
                    <BoxColorButton controller={controller}/>
                    <CommandButton controller={controller} command={ToggleFullWidthBox}/>
                </ToolGroup>
            )}
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
            {!isTableSelection && (
                <ToolGroup>
                    <ToolButton disabled>
                        <Icon size={1} path={mdiGestureTapButton}/>
                    </ToolButton>
                    <DynamicTextButton controller={controller}/>
                    <CommandButton controller={controller} command={InsertBox}/>
                    <ToolButton disabled>
                        <Icon size={1} path={mdiCreation}/>
                    </ToolButton>
                    <CommandButton controller={controller} command={InsertImage}/>
                    <InsertTableButton controller={controller}/>
                    <ToolButton disabled>
                        <Icon size={1} path={mdiCodeTags}/>
                    </ToolButton>
                </ToolGroup>
            )}
            {isTableSelection && (
                <>
                    <ToolGroup>
                        <CommandButton controller={controller} command={InsertTableRowBefore}/>
                        <CommandButton controller={controller} command={InsertTableRowAfter}/>
                        <CommandButton controller={controller} command={InsertTableColumnBefore}/>
                        <CommandButton controller={controller} command={InsertTableColumnAfter}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={RemoveTableRow}/>
                        <CommandButton controller={controller} command={RemoveTableColumn}/>
                    </ToolGroup>
                    <ToolGroup>
                        <CommandButton controller={controller} command={MergeTableCells}/>
                        <CommandButton controller={controller} command={SplitTableCell}/>
                    </ToolGroup>
                </>
            )}
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
        </Toolbar>
    );
};

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexWrap: "wrap",
    }
});
