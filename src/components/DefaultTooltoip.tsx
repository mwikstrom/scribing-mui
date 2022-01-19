import { Tooltip } from "@material-ui/core";
import React, {  } from "react";
import { ScribingComponent,  ScribingTooltipProps } from "scribing-react";

export const DefaultTooltip: ScribingComponent<ScribingTooltipProps> = props => {
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

