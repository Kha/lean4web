import React, { useState } from "react";
import "./css/Nav.css";

import MoonIcon from "./assets/moon-outline.svg?react";
import GitHubIcon from "./assets/github.svg?react"

export interface NavItem {
  title: React.ReactNode;
  url?: string;
  active?: boolean;
  alt?: string;
  classes?: string;
  blank?: boolean;
}

const NavItemComponent: React.FC<{ item: NavItem }> = ({ item }) => {
  const classes = item.classes ? ` ${item.classes}` : "";

  return (
    <li className={`nav-item-lean${item.active ? " active" : ""}`}>
      {item.url ? (
        <a
          href={item.url}
          className={`nav-linklean${classes}`}
          aria-label={item.alt || ""}
          target={item.blank ? "_blank" : "_self"}
          rel={item.blank ? "noopener noreferrer" : undefined}
        >
          {item.title}
        </a>
      ) : (
        <button
          className={`nav-linklean${classes}`}
          aria-label={item.alt || ""}
        >
          {item.title}
        </button>
      )}
    </li>
  );
};

// Main navigation bar component
interface NavBarProps {
  leftItems: NavItem[];
  rightItems: NavItem[];
  menuItems: NavItem[];
  externalLinks: NavItem[];
}

export const NavBar: React.FC<NavBarProps> = ({
  leftItems,
  rightItems,
  menuItems,
  externalLinks,
}) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isFroOpen, setIsFroOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="navbar" role="navigation" aria-label="Primary navigation">
        <div className="navbar-container container">
          <a className="nav-logo" href="https://lean-lang.org/">
            <svg
              width="70"
              height="20"
              viewBox="0 0 486 169"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#386EE0"
              fill="transparent"
              strokeWidth="10"
            >
              <path
                d="M206.333 5.67949H105.667M206.333 5.67949L243.25 84.5M206.333 5.67949V84.5M243.25 84.5H317.549M243.25 84.5L279.667 163.321L280.889 163.318L317.549 84.5M206.333 84.5V163.321H5V5M206.333 84.5H105.667M317.549 84.5L353 5.67949M353 5.67949V164M353 5.67949H353.667L480.333 163.454H481V5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </a>

          {/* Mobile toggle button */}
          <div className="nav-toggle">
            <input
              type="checkbox"
              id="nav-toggle"
              className="nav-toggle-checkbox"
              checked={isNavOpen}
              onChange={(e) => setIsNavOpen(e.target.checked)}
            />
            <label
              htmlFor="nav-toggle"
              className="nav-toggle-label"
              aria-label="Toggle navigation menu"
            >
              ☰
            </label>
          </div>

          {/* Desktop navigation menu */}
          <menu className="desktop-menu">
            <ul className="desktop-menu-part">
              {leftItems.map((item, index) => (
                <NavItemComponent key={index} item={item} />
              ))}
              <li>
                <span className="divider" />
              </li>
              {externalLinks.map((item, index) => (
                <NavItemComponent key={index} item={item} />
              ))}
            </ul>
            <ul className="desktop-menu-part">
              {rightItems.map((item, index) => (
                <NavItemComponent key={index} item={item} />
              ))}
            </ul>
          </menu>
        </div>

        {/* Mobile navigation menu */}
        <menu className="mobile-nav">
          <ul className="nav-list">
            {leftItems.slice(0, -1).map((item, index) => (
              <NavItemComponent key={index} item={item} />
            ))}
            {externalLinks.slice(0, -1).map((item, index) => (
              <NavItemComponent key={index} item={item} />
            ))}
            <li className="nav-item-lean has-submenu">
              <input
                type="checkbox"
                id="fro-toggle"
                className="fro-toggle-checkbox"
                hidden
                checked={isFroOpen}
                onChange={(e) => setIsFroOpen(e.target.checked)}
              />
              <label
                htmlFor="fro-toggle"
                className="nav-linklean"
                aria-label="Toggle navigation menu"
              >
                FRO
              </label>
              <ul className="submenu">
                {menuItems.map((item, index) => (
                  <NavItemComponent key={index} item={item} />
                ))}
              </ul>
            </li>
          </ul>
        </menu>
      </nav>
    </header>
  );
};

// Example usage component
const NavBarLean: React.FC = () => {
  const outItems: NavItem[] = [
    { title: "Playground", url: "https://live.lean-lang.org/", blank: true },
    {
      title: "Reservoir",
      url: "https://reservoir.lean-lang.org/",
      blank: true,
    },
  ];

  const rightItems: NavItem[] = [
    {
      title: <GitHubIcon style={{fill: "var(--color-text)"}}  />,
      alt: "Github",
      url: "https://github.com/leanprover/lean4",
      blank: true,
    },
  ];

  const leftItems: NavItem[] = [
    { title: "Install", url: "https://lean-lang.org/install" },
    { title: "Learn", url: "https://lean-lang.org/learn" },
    { title: "Community", url: "https://lean-lang.org/community" },
    { title: "Use Cases", url: "https://lean-lang.org/usecases" },
    { title: "FRO", url: "https://lean-lang.org/fro" },
  ];

  const menuItems = [
    { title: "Home", url: "https://lean-lang.org/fro" },
    { title: "About", url: "https://lean-lang.org/fro/about" },
    { title: "Team", url: "https://lean-lang.org/fro/team" },
    { title: "Roadmap", url: "https://lean-lang.org/fro/roadmap" },
    { title: "Contact", url: "https://lean-lang.org/fro/contact" },

  ];

  return (
    <NavBar
      leftItems={leftItems}
      rightItems={rightItems}
      menuItems={menuItems}
      externalLinks={outItems}
    />
  );
};

export default NavBarLean;
