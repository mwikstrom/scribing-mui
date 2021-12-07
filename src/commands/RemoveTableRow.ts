import { mdiTableRowRemove } from "@mdi/js";
import { Command } from "./Command";

export const RemoveTableRow: Command = {
    exec: controller => controller.removeTableRow(),
    isDisabled: controller => !controller || !controller.isTableSelection(),
    iconPath: mdiTableRowRemove,
};