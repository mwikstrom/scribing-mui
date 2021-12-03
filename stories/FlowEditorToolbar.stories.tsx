import React, { useMemo, useState } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FlowEditorToolbar } from "../src/FlowEditorToolbar";
import { createTheme, MuiThemeProvider } from "@material-ui/core";
import { FlowEditor, FlowEditorController } from "scribing-react";

export default {
    title: "FlowEditorToolbar",
    component: FlowEditorToolbar,
} as ComponentMeta<typeof FlowEditorToolbar>;
  
const Template: ComponentStory<typeof FlowEditorToolbar> = args => {
    const [controller, setController] = useState<FlowEditorController | null>(null);
    const theme = useMemo(() => createTheme(), []);
    return (
        <MuiThemeProvider theme={theme}>
            <FlowEditorToolbar {...args} controller={controller}/>
            <FlowEditor onControllerChange={setController}/>
        </MuiThemeProvider>
    );
};

export const Default = Template.bind({});
Default.args = {};
