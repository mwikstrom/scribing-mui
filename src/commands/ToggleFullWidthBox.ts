import { mdiArrowExpandHorizontal } from "@mdi/js";
import { Command } from "./Command";

export const ToggleFullWidthBox: Command = {
    exec: controller => {
        const { inline = true } = controller.getBoxStyle();
        controller.formatBox("inline", !inline);
    },
    isActive: controller => controller.getBoxStyle().inline === false,
    iconPath: mdiArrowExpandHorizontal,
};