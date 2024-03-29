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

const icon = { icon: "@mdi/power" };

const btn = (text: string, variant: BoxVariant = "outlined", color: FlowColor = "default") => ({
    box: [icon, " " + text],
    style: {
        variant,
        color,
        interaction: { script: "{ await delay(1000); throw new Error('This failed intentionally'); }" },
    }
});

const disabled = (text: string, variant: BoxVariant = "outlined", color: FlowColor = "default") => ({
    box: [icon, " " + text],
    style: {
        variant,
        color,
        source: "false",
        interaction: { script: "throw new Error('This should not happen'); }" },
    }
});

const dual = (text: string, variant: BoxVariant = "outlined", color: FlowColor = "default") => [
    btn(text, variant, color),
    disabled(`Disabled ${text}`, variant, color),
];

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
    ].flatMap(text => dual(text)),
    { break: "para" },
    "Default color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "default"),
    ...dual("Contained", "contained", "default"),
    ...dual("Basic", "basic", "default"),
    { break: "para" },
    "Primary color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "primary"),
    ...dual("Contained", "contained", "primary"),
    ...dual("Basic", "basic", "primary"),
    { break: "para" },
    "Secondary color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "secondary"),
    ...dual("Contained", "contained", "secondary"),
    ...dual("Basic", "basic", "secondary"),
    { break: "para" },
    "Subtle color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "subtle"),
    ...dual("Contained", "contained", "subtle"),
    ...dual("Basic", "basic", "subtle"),
    { break: "para" },
    "Information color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "information"),
    ...dual("Contained", "contained", "information"),
    ...dual("Basic", "basic", "information"),
    { break: "para" },
    "Success color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "success"),
    ...dual("Contained", "contained", "success"),
    ...dual("Basic", "basic", "success"),
    { break: "para" },
    "Warning color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "warning"),
    ...dual("Contained", "contained", "warning"),
    ...dual("Basic", "basic", "warning"),
    { break: "para" },
    "Error color:",
    { break: "line"},
    ...dual("Outlined", "outlined", "error"),
    ...dual("Contained", "contained", "error"),
    ...dual("Basic", "basic", "error"),
    { break: "para" },
    ...dual("Quote", "quote"),
    { break: "para" },
    ...dual("Alert", "alert"),
    { break: "para" },
    ...dual("Warning", "alert", "warning"),
    { break: "para" },
    "The end.",
    { break: "para" },
]);

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const LightButtons = Template.bind({});
LightButtons.args = { content: ButtonsContent };

export const DarkButtons = Template.bind({});
DarkButtons.args = { content: ButtonsContent, dark: true };

export const LightImageZoom = Template.bind({});
LightImageZoom.args = {
    content: FlowContent.fromJsonValue([
        "before",
        { break: "para" },
        { image: { url: "https://cdn.dforigo.com/images/ogard-space-3200x1600.png", width: 3200, height: 1600 } },
        { break: "para" },
        "after",
        { break: "para" },
    ]),
};

export const DarkImageZoom = Template.bind({});
DarkImageZoom.args = { ...LightImageZoom.args, dark: true };

export const LightTable = Template.bind({});
LightTable.args = {
    content: FlowContent.fromJsonValue([
        {
            table: {
                "A1": ["Product", { break: "para" }],
                "B1": ["Quantity", { break: "para" }],
                "A2": ["Crap", { break: "para" }],
                "B2": ["12", { break: "para" }],
                "A3": ["Junk", { break: "para" }],
                "B3": ["34", { break: "para" }],
                "default": [{ break: "para" }],
            },
            style: { head: 1 },
        }
    ]),
};

export const DarkTable = Template.bind({});
DarkTable.args = { ...LightTable.args, dark: true };
