import {  mdiTableSplitCell } from "@mdi/js";
import { Command } from "./Command";

export const SplitTableCell: Command = {
    exec: controller => controller.splitTableCell(),
    isDisabled: controller => !controller.canSplitTableCell(),
    iconPath: mdiTableSplitCell,
};