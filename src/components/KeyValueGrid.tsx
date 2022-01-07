import { Box, Theme, Typography } from "@material-ui/core";
import { useTheme } from "@material-ui/styles";
import { 
    DataGrid,
    GridCellValue,
    GridColDef,
    GridColumns,
    GridRenderCellParams,
    GridRowParams
} from "@mui/x-data-grid";
import React, { FC, useMemo } from "react";
import { useMaterialFlowLocale } from "../MaterialFlowLocale";

export interface KeyValueGridProps {
    data: ReadonlyMap<string, string | null>;
    onSetValue: (key: string, value: string) => void;
    onUnsetValue: (key: string) => void;
    keyLabel: string;
    newKeyLabel: string;
    valueLabel?: string;
}

export const KeyValueGrid: FC<KeyValueGridProps> = props => {
    const locale = useMaterialFlowLocale();
    const { data, keyLabel, newKeyLabel, valueLabel = locale.label_value, onSetValue, onUnsetValue } = props;
    const columns = useMemo<GridColumns>(() => {
        const commonProps: Partial<GridColDef> = {
            flex: 1,
            sortable: false,
            editable: true,
        };
        return [
            { 
                ...commonProps,
                field: "key",
                headerName: keyLabel,
                renderCell: (params: GridRenderCellParams) => {
                    const insert = typeof params.id !== "string";
                    const text = insert ? newKeyLabel : params.value;
                    const color = insert ? "textSecondary" : "inherit";
                    return <Cell color={color}>{text}</Cell>;
                },
            },
            {
                ...commonProps,
                field: "value",
                headerName: valueLabel,
                renderCell: (params: GridRenderCellParams) => {
                    const multi = params.value === null;
                    const text = multi ? locale.label_multiple_values : params.value;
                    const color = multi ? "textSecondary" : "inherit";
                    return <Cell color={color}>{text}</Cell>;
                },
            },
        ];
    }, [keyLabel, newKeyLabel, valueLabel, locale]);
    const rows = useMemo(() => [
        ...Array.from(data).map(([key, value]) => ({id: key, key, value })),
        { id: 0, key: "", value: "" }
    ], [data]);
    const onRowEditStop = (params: GridRowParams) => {
        const rowId = params.id;
        const key = params.getValue(rowId, "key");
        const value = params.getValue(rowId, "value");
        if (typeof rowId === "string" && rowId !== key) {
            onUnsetValue(rowId);
        }
        if (typeof key === "string" && key && typeof value === "string") {
            onSetValue(key, value);
        }
    };
    return (
        <DataGrid
            columns={columns}
            rows={rows}
            autoHeight
            density="compact"
            disableColumnFilter
            disableColumnMenu
            disableColumnSelector
            disableDensitySelector
            showColumnRightBorder
            showCellRightBorder
            disableVirtualization
            getRowId={row => row.id}
            hideFooter
            editMode="row"
            onRowEditStop={onRowEditStop}
        />
    );
};

interface CellProps {
    children: GridCellValue;
    color: "inherit" | "textSecondary";
}

const Cell: FC<CellProps> = ({children, color}) => {
    const theme = useTheme<Theme>();
    return (
        <Box paddingLeft={`${theme.spacing(1) - 1}px`}>
            <Typography color={color} variant="inherit">{children}</Typography>
        </Box>
    );
};
