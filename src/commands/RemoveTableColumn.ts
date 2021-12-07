import { mdiTableColumnRemove } from "@mdi/js";
import { Command } from "./Command";

export const RemoveTableColumn: Command = {
    exec: controller => controller.removeTableColumn(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableColumnRemove,
};