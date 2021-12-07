import { mdiTableColumnPlusAfter } from "@mdi/js";
import { Command } from "./Command";

export const InsertTableColumnAfter: Command = {
    exec: controller => controller.insertTableColumnAfter(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableColumnPlusAfter,
};