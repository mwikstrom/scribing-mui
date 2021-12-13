import { mdiEyeCheck } from "@mdi/js";
import { Command } from "./Command";

export const TogglePreview: Command = {
    exec: controller => controller.togglePreview(),
    isActive: controller => controller.getPreview(),
    iconPath: mdiEyeCheck,
    ignoreFrozen: true,
};
