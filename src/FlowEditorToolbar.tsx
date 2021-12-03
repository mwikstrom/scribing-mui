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
    mdiFormatBold, 
    mdiFormatColorFill, 
    mdiFormatFont, 
    mdiFormatIndentDecrease, 
    mdiFormatIndentIncrease, 
    mdiFormatItalic, 
    mdiFormatLineSpacing, 
    mdiFormatListBulleted, 
    mdiFormatListNumbered, 
    mdiFormatPilcrow, 
    mdiFormatSize, 
    mdiFormatStrikethrough, 
    mdiFormatSubscript, 
    mdiFormatSuperscript, 
    mdiFormatTextdirectionLToR, 
    mdiFormatTextdirectionRToL, 
    mdiFormatUnderline,
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
export const FlowEditorToolbar: FC<FlowEditorToolbarProps> = () => {
    const classes = useStyles();
    return (
        <Toolbar className={classes.root} disableGutters>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiUndo}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiRedo}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiContentCopy}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiContentCut}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiContentPaste}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatBold}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatItalic}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatUnderline}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatStrikethrough}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatSubscript}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatSuperscript}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Stack size={1}>
                        <Icon path={mdiFormatColorFill}/>
                        <Icon path={mdiColorHelper}/>
                    </Stack>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatFont}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatSize}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatAlignLeft}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatAlignCenter}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatAlignRight}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatAlignJustify}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatListBulleted}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatListNumbered}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatIndentDecrease}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatIndentIncrease}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiGestureTapButton}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFunctionVariant}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTextBoxPlusOutline}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiCreation}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiImagePlus}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTablePlus}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiCodeTags}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiTableRowPlusBefore}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTableRowPlusAfter}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTableColumnPlusBefore}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTableColumnPlusAfter}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiTableRowRemove}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTableColumnRemove}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiTableMergeCells}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiTableSplitCell}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiArrowExpandHorizontal}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatLineSpacing}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatTextdirectionLToR}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiFormatTextdirectionRToL}/>
                </ToolButton>
                <ToolButton>
                    <Icon size={1} path={mdiSpellcheck}/>
                </ToolButton>
            </ToolGroup>
            <ToolGroup>
                <ToolButton>
                    <Icon size={1} path={mdiFormatPilcrow}/>
                </ToolButton>
                <ToolButton>
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
