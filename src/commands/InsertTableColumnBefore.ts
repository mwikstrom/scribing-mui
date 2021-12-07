import { mdiTableColumnPlusBefore } from "@mdi/js";
import { Command } from "./Command";

export const InsertTableColumnBefore: Command = {
    exec: controller => controller.insertTableColumnBefore(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableColumnPlusBefore,
};