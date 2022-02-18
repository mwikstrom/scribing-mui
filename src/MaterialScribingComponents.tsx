import React, { FC } from "react";
import { ScribingComponentOverride, ScribingComponents} from "scribing-react";
import { DefaultButton } from "./components/DefaultButton";
import { DefaultTooltip } from "./components/DefaultTooltip";

/** @public */
export const MaterialScribingComponents: FC<Partial<ScribingComponents>> = props => {
    const { Tooltip = DefaultTooltip, Button = DefaultButton, ...otherProps } = props;
    return <ScribingComponentOverride Tooltip={Tooltip} Button={Button} {...otherProps}/>;
};
