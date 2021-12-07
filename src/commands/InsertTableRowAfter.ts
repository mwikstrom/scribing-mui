import { mdiTableRowPlusAfter } from "@mdi/js";
import { Command } from "./Command";

export const InsertTableRowAfter: Command = {
    exec: controller => controller.insertTableRowAfter(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableRowPlusAfter,
};