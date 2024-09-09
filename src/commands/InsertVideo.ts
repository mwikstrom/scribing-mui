import { mdiMovieEdit, mdiMoviePlus } from "@mdi/js";
import { fileOpen } from "browser-fs-access";
import { FlowVideo } from "scribing";
import { Command } from "./Command";

export const InsertVideo: Command = {
    exec: async controller => {
        const file = await fileOpen({
            description: "Video files",
            mimeTypes: ["video/mp4", "video/webm"],
            extensions: [".mp4", ".webm"]
        });

        const source = await controller.uploadVideoSource(file);

        if (controller.isVideo()) {
            controller.setVideoSource(source);
        } else {
            controller.insertNode(new FlowVideo({ source, style: controller.getCaretStyle(), scale: 1 }));
        }
    },
    isDisabled: controller => !controller.isCaret() && !controller.isVideo(),
    isActive: controller => controller?.isVideo(),
    iconPath: controller => controller?.isVideo() ? mdiMovieEdit : mdiMoviePlus,
};