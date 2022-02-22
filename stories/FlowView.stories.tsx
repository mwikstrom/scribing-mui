import React, { FC } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { MuiThemeProvider, Theme } from "@material-ui/core";
import { FlowView } from "scribing-react";
import { MaterialFlowPalette } from "../src/MaterialFlowPalette";
import { makeStyles } from "@material-ui/styles";
import { FlowContent } from "scribing";
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

const btn = (text: string) => ({
    box: [text],
    style: {
        variant: "outlined",
        interaction: { script: "" },
    }
});

const ButtonsContent = FlowContent.fromJsonValue([
    "Here be many buttons:",
    { break: "para" },
    ...["First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eight", "Nineth", "Tenth"].map(btn),
    { break: "para" },
    "The end.",
    { break: "para" },
]);

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const LightButtons = Template.bind({});
LightButtons.args = { content: ButtonsContent };

export const DarkButtons = Template.bind({});
DarkButtons.args = { content: ButtonsContent, dark: true };

