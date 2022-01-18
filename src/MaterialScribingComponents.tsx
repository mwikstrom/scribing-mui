import { Tooltip } from "@material-ui/core";
import React, { FC } from "react";
import { ScribingComponent, ScribingComponentOverride, ScribingComponents, ScribingTooltipProps } from "scribing-react";

/** @public */
export const MaterialScribingComponents: FC<Partial<ScribingComponents>> = props => {
    const { Tooltip = DefaultTooltip, ...otherProps } = props;
    return <ScribingComponentOverride Tooltip={Tooltip} {...otherProps}/>;
};

const DefaultTooltip: ScribingComponent<ScribingTooltipProps> = props => {
    const { title, ...otherProps } = props;
    return (
        <Tooltip
            title={title || ""}
            arrow
            interactive
            placement="top"
            {...otherProps}
        />
    );
};
