import { mdiTableRowPlusBefore } from "@mdi/js";
import { Command } from "./Command";

export const InsertTableRowBefore: Command = {
    exec: controller => controller.insertTableRowBefore(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableRowPlusBefore,
};