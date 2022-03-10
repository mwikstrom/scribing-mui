import { SyntaxNode } from "@lezer/common";

export const isInsideBlock = (node: SyntaxNode | null): boolean => {
    if (!node) {
        return false;
    } else if (node.name === "Block") {
        return true;
    } else {
        return isInsideBlock(node.parent);
    }
};
