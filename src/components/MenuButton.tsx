import React, { forwardRef, ReactNode, Ref, useCallback, useState } from "react";
import { Menu, useForkRef } from "@material-ui/core";
import { ToolButton, ToolButtonProps } from "./ToolButton";

export interface MenuButtonProps extends ToolButtonProps {
    menu: ReactNode;
}

export const MenuButton = forwardRef((props: MenuButtonProps, ref: Ref<HTMLButtonElement>) => {
    const { menu, onClick, ...rest } = props;
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [buttonRef, setButtonRef] = useState<HTMLElement | null>(null);
    const forkRef = useForkRef<HTMLButtonElement>(ref, setButtonRef);
    const closeMenu = useCallback(() => setMenuOpen(false), []);
    const onClickOverride = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        if (onClick) {
            onClick(e);
        }
        if (!e.defaultPrevented) {
            setMenuOpen(true);
        }
    }, [onClick]);
    const onClickInMenu = useCallback((e: React.MouseEvent) => {
        if (!e.defaultPrevented) {
            closeMenu();
        }
    }, [closeMenu]);
    return (
        <>
            <ToolButton
                {...rest}
                ref={forkRef}
                onClick={onClickOverride}
            />
            <Menu
                open={isMenuOpen}
                anchorEl={buttonRef}
                onClose={closeMenu}
                onClick={onClickInMenu}
                children={menu}
            />
        </>
    );
});
