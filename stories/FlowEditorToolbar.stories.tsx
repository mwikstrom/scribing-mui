import React, { FC, useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FlowEditorToolbar } from "../src/FlowEditorToolbar";
import { createTheme, MuiThemeProvider, Paper } from "@material-ui/core";
import { FlowEditor, FlowEditorController } from "scribing-react";

interface StoryProps {
    dark?: boolean;
}

const Story: FC<StoryProps> = props => {
    const { dark } = props;
    const [controller, setController] = useState<FlowEditorController | null>(null);
    const theme = useMemo(() => createTheme({ palette: { type: dark ? "dark" : "light" }  }), [dark]);
    return (
        <MuiThemeProvider theme={theme}>
            <Paper>
                <FlowEditorToolbar controller={controller}/>
                <FlowEditor onControllerChange={setController} autoFocus/>
            </Paper>
        </MuiThemeProvider>
    );
};

export default {
    title: "FlowEditorToolbar",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

export const Light = Template.bind({});
Light.args = {};

export const Dark = Template.bind({});
Dark.args = { dark: true };
