import React from 'react';

interface PropsMenu {
    children: React.ReactNode;
}

interface PropsMenuItem {
    children: React.ReactNode;
}

const Menu = ({ children }: PropsMenu) => {
    return <ul className="w-full py-2 rounded shadow bg-white">{children}</ul>;
};

const MenuItem = ({ children }: PropsMenuItem) => {
    return <li className="hover:bg-neutral-100">{children}</li>;
};

Menu.MenuItem = MenuItem;

export default Menu;
