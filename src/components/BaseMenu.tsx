import React, { CSSProperties } from 'react';
import { Menu } from 'antd';
import { LinkProps, Link } from 'react-router-dom';
import { MenuProps } from 'antd/lib/menu/index.d';
import { MenuItemProps } from 'antd/lib/menu/MenuItem';
import { get } from 'lodash';

const { SubMenu, Item } = Menu;

export interface BaseMenuProps {
  menuConfig: BaseMenuConfig[];
  menuProps?: MenuProps;
}

export interface BaseMenuConfig {
  path: string;
  title: React.ReactNode;
  linkProps?: Omit<LinkProps, 'to' | 'title'>;
  menuItemProps?: MenuItemProps;
  children?: BaseMenuConfig[];
  id?: number
  isSubMenu?: Boolean
}

const noSelectedStyle: CSSProperties = { userSelect: 'none' };

const defaultBaseMenuProps: any = {
  className: "epidemic-sider-menu",
  mode: "inline",
  defaultSelectedKeys: ['1'],
  defaultOpenKeys: ['sub1'],
  style: { height: '100%' }
}

const generateMenuItem = ({
  path,
  title,
  linkProps,
  menuItemProps,
}: Omit<BaseMenuConfig, 'children'>) => {
  return (
    <Item key={path} {...menuItemProps}>
      <Link
        {...{
          to: path,
          rel: 'noopener noreferrer',
          style: noSelectedStyle,
          ...linkProps,
        }}
      >
        {title}
      </Link>
    </Item>
  );
};

const BaseMenu: React.FunctionComponent<BaseMenuProps> = ({ menuConfig, menuProps }) => {
  return (
    <Menu {...{ ...defaultBaseMenuProps, ...menuProps }}>
      {menuConfig.map(({ children, ...otherProps }) =>
        !children ? (
          generateMenuItem(otherProps)
        ) : (
            <SubMenu
              key={otherProps.path}
              title={otherProps.title}
              style={noSelectedStyle}
              icon={get(otherProps, 'menuItemProps.icon')}
            >
              {children.map((v) => generateMenuItem(v))}
            </SubMenu>
          ),
      )}
    </Menu>
  );
};

export default BaseMenu;
