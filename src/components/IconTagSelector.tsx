import { MenuItem, Select, Typography } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import { FC } from "react";
import { useDataIconTags } from "scribing-react";
import { useMaterialFlowLocale } from "..";

export interface IconTagSelectorProps {
    pack: string;
    selected?: string;
    onChange?: (tag: string) => void;
    className?: string;
}

export const IconTagSelector: FC<IconTagSelectorProps> = props => {
    const { pack, selected = "", onChange, className } = props;
    const actualTags = useDataIconTags(pack);
    const tagArray = useMemo(() => ["", ...(actualTags ?? [])], [actualTags]);
    const handleChange = useCallback((e: React.ChangeEvent<{value: unknown}>) => {
        const { value } = e.target;
        if (onChange && typeof value === "string") {            
            onChange(value);
        }
    }, [onChange]);
    const locale = useMaterialFlowLocale();
    return actualTags && actualTags.length > 0 ? (
        <Select
            variant="outlined" 
            autoWidth 
            value={selected} 
            className={className}
            onChange={handleChange}
            displayEmpty
            renderValue={value => (
                <Typography>{value ? String(value) : locale.label_all_categories}</Typography>
            )}
            children={tagArray?.map(tag => (
                <MenuItem key={tag} value={tag}>{tag ? tag : locale.label_all_categories}</MenuItem>
            ))}    
        />
    ) : null;
};
