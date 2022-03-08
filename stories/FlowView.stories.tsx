import React, { FC } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { FlowView } from "scribing-react";
import { MaterialFlowPalette } from "../src/MaterialFlowPalette";
import { makeStyles } from "@material-ui/styles";
import { BoxVariant, FlowColor, FlowContent } from "scribing";
import { useStoryTheme } from "./theme";
import { MaterialFlowTypography } from "../src/MaterialFlowTypography";
import { MaterialScribingComponents } from "../src/MaterialScribingComponents";

interface StoryProps {
    dark?: boolean;
    content?: FlowContent;
}

const Story: FC<StoryProps> = props => {
    const { dark, ...rest } = props;
    const theme = useStoryTheme(dark);
    return (
        <MuiThemeProvider theme={theme}>
            <Root {...rest}/>
        </MuiThemeProvider>
    );
};

const Root: FC<Omit<StoryProps, "dark">> = props => {
    const { content = FlowContent.emptyParagraph } = props;
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <MaterialFlowTypography>
                <MaterialFlowPalette>
                    <MaterialScribingComponents>
                        <FlowView content={content}/>
                    </MaterialScribingComponents>
                </MaterialFlowPalette>
            </MaterialFlowTypography>
        </div>
    );
};

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
    },
    toolbar: {
    },
    editor: {
        flex: 1,
        overflow: "auto",
    },
}));

export default {
    title: "FlowView",
    component: Story,
} as ComponentMeta<typeof Story>;

const btn = (text: string, variant: BoxVariant = "outlined", color: FlowColor = "default") => ({
    box: [text],
    style: {
        variant,
        color,
        interaction: { script: "{ await delay(1000); throw new Error('This failed intentionally'); }" },
    }
});

const ButtonsContent = FlowContent.fromJsonValue([
    "Here be many buttons:",
    { break: "para" },
    ...[
        "First", 
        "Second", 
        "Third", 
        "Fourth", 
        "Fifth", 
        "Sixth", 
        "Seventh", 
        "Eight", 
        "Nineth", 
        "Tenth"
    ].map(text => btn(text)),
    { break: "para" },
    "Primary color:",
    { break: "line"},
    btn("Outlined", "outlined", "primary"),
    btn("Contained", "contained", "primary"),
    btn("Basic", "basic", "primary"),
    { break: "para" },
    "Secondary color:",
    { break: "line"},
    btn("Outlined", "outlined", "secondary"),
    btn("Contained", "contained", "secondary"),
    btn("Basic", "basic", "secondary"),
    { break: "para" },
    "Subtle color:",
    { break: "line"},
    btn("Outlined", "outlined", "subtle"),
    btn("Contained", "contained", "subtle"),
    btn("Basic", "basic", "subtle"),
    { break: "para" },
    "Information color:",
    { break: "line"},
    btn("Outlined", "outlined", "information"),
    btn("Contained", "contained", "information"),
    btn("Basic", "basic", "information"),
    { break: "para" },
    "Success color:",
    { break: "line"},
    btn("Outlined", "outlined", "success"),
    btn("Contained", "contained", "success"),
    btn("Basic", "basic", "success"),
    { break: "para" },
    "Warning color:",
    { break: "line"},
    btn("Outlined", "outlined", "warning"),
    btn("Contained", "contained", "warning"),
    btn("Basic", "basic", "warning"),
    { break: "para" },
    "Error color:",
    { break: "line"},
    btn("Outlined", "outlined", "error"),
    btn("Contained", "contained", "error"),
    btn("Basic", "basic", "error"),
    { break: "para" },
    btn("Quote", "quote"),
    { break: "para" },
    btn("Alert", "alert"),
    { break: "para" },
    btn("Warning", "alert", "warning"),
    { break: "para" },
    "The end.",
    { break: "para" },
]);

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const LightButtons = Template.bind({});
LightButtons.args = { content: ButtonsContent };

export const DarkButtons = Template.bind({});
DarkButtons.args = { content: ButtonsContent, dark: true };

