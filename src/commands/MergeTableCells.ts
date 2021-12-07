import { mdiTableMergeCells } from "@mdi/js";
import { Command } from "./Command";

export const MergeTableCells: Command = {
    exec: controller => controller.mergeTableCells(),
    isDisabled: controller => !controller.canMergeTableCells(),
    iconPath: mdiTableMergeCells,
};