import { mdiFormatIndentIncrease } from "@mdi/js";
import { Command } from "./Command";

export const IncrementIndent: Command = {
    exec: controller => controller.incrementListLevel(),
    isDisabled: controller => {
        const level = controller.getListLevel();
        return typeof level === "number" && level >= 9;
    },
    iconPath: mdiFormatIndentIncrease,
};