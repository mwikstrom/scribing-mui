import React, { FC } from "react";
import { ComponentStory, ComponentMeta } from "@storybook/react";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import { useStoryTheme } from "./theme";
import { DefaultButton } from "../src/components/DefaultButton";
import { ScribingButtonProps } from "scribing-react";
import { BoxStyle, BoxVariant, FlowColor } from "scribing";

interface StoryProps extends ScribingButtonProps {
    dark?: boolean;
    variant?: BoxVariant,
    color?: FlowColor;
}

const Story: FC<StoryProps> = props => {
    const { dark, ...rest } = props;
    const theme = useStoryTheme(dark);
    return (
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <DefaultButton {...rest}/>
        </MuiThemeProvider>
    );
};

export default {
    title: "DefaultButton",
    component: Story,
} as ComponentMeta<typeof Story>;

const Template: ComponentStory<typeof Story> = args => <Story {...args}/>;

const story = (args: Partial<StoryProps>) => {
    const {
        pending = false,
        error = false,
        disabled = false,
        variant = "outlined",
        color = "default",
        style = BoxStyle.empty.merge({ variant, color, inline: true }),
        hover = false,
        href = null,
        ref = () => void 0,
        children = "Button",
    } = args;
    const props = { ...args, pending, error, disabled, style, hover, href, ref, children };
    const bound = Template.bind(props);
    bound.args = props;
    return bound;
};

export const Light = story({ });
export const LightSubtle = story({ color: "subtle" });
export const LightError = story({ error: true });
export const LightPending = story({ pending: true });
export const Dark = story({ dark: true });
