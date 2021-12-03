import React from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { FlowEditorToolbar } from "../src/FlowEditorToolbar";

export default {
    title: "FlowEditorToolbar",
    component: FlowEditorToolbar,
} as ComponentMeta<typeof FlowEditorToolbar>;
  
const Template: ComponentStory<typeof FlowEditorToolbar> = args => <FlowEditorToolbar {...args}/>;

export const Default = Template.bind({});
Default.args = {};
