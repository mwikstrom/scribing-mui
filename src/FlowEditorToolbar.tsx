import React, { FC } from "react";
import { FlowEditorController } from "scribing-react";
import { Toolbar } from "@material-ui/core";
import Icon, { Stack } from "@mdi/react";
import { 
    mdiArrowExpandHorizontal,
    mdiCodeTags,
    mdiColorHelper,
    mdiContentCopy,
    mdiContentCut,
    mdiContentPaste,
    mdiCreation,
    mdiEyeCheck,
    mdiFormatAlignCenter,
    mdiFormatAlignJustify,
    mdiFormatAlignLeft,
    mdiFormatAlignRight,
    mdiFormatColorFill, 
    mdiFormatFont, 
    mdiFormatIndentDecrease, 
    mdiFormatIndentIncrease, 
    mdiFormatLineSpacing, 
    mdiFormatListBulleted, 
    mdiFormatListNumbered, 
    mdiFormatPilcrow, 
    mdiFormatSize, 
    mdiFormatTextdirectionLToR, 
    mdiFormatTextdirectionRToL, 
    mdiFunctionVariant,
    mdiGestureTapButton,
    mdiImagePlus,
    mdiRedo,
    mdiSpellcheck,
    mdiTableColumnPlusAfter,
    mdiTableColumnPlusBefore,
    mdiTableColumnRemove,
    mdiTableMergeCells,
    mdiTablePlus,
    mdiTableRowPlusAfter,
    mdiTableRowPlusBefore,
    mdiTableRowRemove,
    mdiTableSplitCell,
    mdiTextBoxPlusOutline,
    mdiUndo,
} from "@mdi/js";
import { makeStyles } from "@material-ui/styles";
import { ToolGroup } from "./ToolGroup";
import { ToolButton } from "./ToolButton";
import { CommandButton } from "./CommandButton";
import { ToggleBold } from "./commands/ToggleBold";
import { ToggleItalic } from "./commands/ToggleItalic";
import { ToggleUnderline } from "./commands/ToggleUnderline";
import { ToggleStrikeThrough } from "./commands/ToggleStrikeThrough";
import { ToggleSubscript } from "./commands/ToggleSubscript";
import { ToggleSuperscript } from "./commands/ToggleSuperscript";

/** @public */
export interface FlowEditorToolbarProps {
    controller?: FlowEditorController | null;
}

// TODO: Paragraph variant dropdown
// TODO: Box variant dropdown
// TODO: Insert component
// TODO: Check-in?
// TODO: Connection status?

/** @public */
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = props => {
    const { controller } = props;
    const classes = useStyles();
    return (
        <Toolbar className={classes.root} disableGutters>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiUndo}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiRedo}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiContentCopy}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiContentCut}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiContentPaste}/>
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
            <ToolGroup>
                <ToolButton disabled>
                    <Stack size={1}>
                        <Icon path={mdiFormatColorFill}/>
                        <Icon path={mdiColorHelper}/>
                    </Stack>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatFont}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatSize}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatAlignLeft}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatAlignCenter}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatAlignRight}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatAlignJustify}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatListBulleted}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatListNumbered}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatIndentDecrease}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatIndentIncrease}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiGestureTapButton}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFunctionVariant}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTextBoxPlusOutline}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiCreation}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiImagePlus}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTablePlus}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiCodeTags}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableRowPlusBefore}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableRowPlusAfter}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableColumnPlusBefore}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableColumnPlusAfter}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableRowRemove}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableColumnRemove}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableMergeCells}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiTableSplitCell}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiArrowExpandHorizontal}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatLineSpacing}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatTextdirectionLToR}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatTextdirectionRToL}/>
                </ToolButton>
                <ToolButton disabled>
                    <Icon size={1} path={mdiSpellcheck}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton disabled>
                    <Icon size={1} path={mdiFormatPilcrow}/>
                </ToolButton>
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
