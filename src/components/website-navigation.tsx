"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import { MenuTreeItem } from "@/types/website-menu";
import { getPublicWebsiteMenus } from "@/lib/website-menu-actions";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDropdownMenu } from "@/hooks/use-dropdown-menu";

interface WebsiteNavigationProps {
  className?: string;
}

export function WebsiteNavigation({ className = "" }: WebsiteNavigationProps) {
  const [menus, setMenus] = useState<MenuTreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const {
    activeDropdown,
    dropdownRef,
    openDropdown,
    closeDropdown,
    toggleDropdown,
    forceClose,
  } = useDropdownMenu({
    closeOnEscape: true,
    closeOnClickOutside: true,
    hoverDelay: 150,
  });

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const { data = [], success } = await getPublicWebsiteMenus();
        if (success) {
          setMenus(data);
        }
      } catch (error) {
        console.error("Error fetching menus:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  const handleMouseEnter = (menuId: string) => {
    if (!isMobile) {
      openDropdown(menuId);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      closeDropdown();
    }
  };

  const handleMenuToggle = (menuId: string) => {
    toggleDropdown(menuId);
  };

  const handleLinkClick = () => {
    forceClose();
  };

  if (loading) {
    return (
      <nav className={`${className} website-nav`}>
        <div className="flex space-x-4 lg:space-x-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-6 w-16 lg:w-20 nav-skeleton bg-gray-200 dark:bg-gray-700 animate-pulse rounded"
            ></div>
          ))}
        </div>
      </nav>
    );
  }

  const renderMenuItem = (menu: MenuTreeItem) => {
    const hasChildren = menu.children && menu.children.length > 0;
    const isActive = activeDropdown === menu.id;

    if (menu.isMegaMenu && hasChildren) {
      // Render responsive mega menu
      return (
        <div
          key={menu.id}
          className="nav-item mega-menu-item"
          onMouseEnter={() => handleMouseEnter(menu.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
            onClick={() => handleMenuToggle(menu.id)}
            aria-expanded={isActive}
            aria-haspopup="true"
          >
            <span>{menu.title}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          </button>

          {isActive && (
            <>
              {/* Backdrop for mobile */}
              {isMobile && (
                <div
                  className="fixed inset-0 bg-black/20 mobile-backdrop nav-mobile-backdrop"
                  onClick={forceClose}
                />
              )}

              <div
                className={`
                nav-mega-menu dropdown-content absolute z-50 bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden
                transition-all duration-300 transform
                ${
                  isMobile
                    ? "fixed left-4 right-4 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto mobile-menu-container"
                    : "top-full left-0 right-0 w-auto inline-block mt-2 desktop-mega-menu"
                }
                ${
                  isActive
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }
              `}
              >
                <div
                  className={`
                  grid gap-6 p-6 overflow-visible mega-menu-content
                  ${
                    isMobile
                      ? "grid-cols-1"
                      : menu.children.length === 1
                      ? "grid-cols-1"
                      : menu.children.length === 2
                      ? "grid-cols-1 sm:grid-cols-2"
                      : menu.children.length === 3
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
                      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                  }
                `}
                >
                  {menu.children.map((child) => (
                    <div key={child.id} className="space-y-3">
                      <Link
                        href={child.url || "#"}
                        className="block font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-base transition-colors duration-200"
                        onClick={handleLinkClick}
                      >
                        {child.title}
                      </Link>
                      {child.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {child.description}
                        </p>
                      )}
                      {child.children && child.children.length > 0 && (
                        <ul className="space-y-2">
                          {child.children.map((grandChild) => (
                            <li key={grandChild.id}>
                              <Link
                                href={grandChild.url || "#"}
                                className="block text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-1"
                                onClick={handleLinkClick}
                              >
                                {grandChild.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    } else if (hasChildren) {
      // Render responsive dropdown
      return (
        <div
          key={menu.id}
          className="relative nav-item"
          onMouseEnter={() => handleMouseEnter(menu.id)}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center space-x-1 px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
            onClick={() => handleMenuToggle(menu.id)}
            aria-expanded={isActive}
            aria-haspopup="true"
          >
            <span>{menu.title}</span>
            <ChevronDownIcon
              className={`h-4 w-4 transition-transform duration-200 ${
                isActive ? "rotate-180" : ""
              }`}
            />
          </button>

          {isActive && (
            <>
              {/* Backdrop for mobile */}
              {isMobile && (
                <div
                  className="fixed inset-0 bg-black/20 mobile-backdrop nav-mobile-backdrop"
                  onClick={forceClose}
                />
              )}

              <div
                className={`
                nav-dropdown dropdown-content absolute z-50 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden
                transition-all duration-200 transform
                ${
                  isMobile
                    ? "fixed left-4 right-4 top-16 max-h-[calc(100vh-5rem)] overflow-y-auto mobile-menu-container"
                    : "top-full left-0 min-w-64 w-auto mt-2 dropdown-position"
                }
                ${
                  isActive
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-95 pointer-events-none"
                }
              `}
              >
                <div className="py-2">
                  {menu.children.map((child) => {
                    const hasGrandchildren =
                      child.children && child.children.length > 0;

                    if (hasGrandchildren && !isMobile) {
                      return (
                        <div key={child.id} className="relative group/submenu">
                          <div
                            className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors duration-200"
                            onMouseEnter={() => handleMouseEnter(child.id)}
                          >
                            <span>{child.title}</span>
                            <ChevronRightIcon className="h-4 w-4 ml-2" />
                          </div>

                          {activeDropdown === child.id && (
                            <div className="absolute left-full top-0 min-w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-md py-2 -mt-2 z-50">
                              {child.children.map((grandChild) => (
                                <Link
                                  key={grandChild.id}
                                  href={grandChild.url || "#"}
                                  className="block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  onClick={handleLinkClick}
                                >
                                  {grandChild.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    } else if (hasGrandchildren && isMobile) {
                      return (
                        <div
                          key={child.id}
                          className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          <div
                            className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
                            onClick={() => handleMenuToggle(child.id)}
                          >
                            <span>{child.title}</span>
                            <ChevronRightIcon
                              className={`h-4 w-4 transition-transform duration-200 ${
                                activeDropdown === child.id ? "rotate-90" : ""
                              }`}
                            />
                          </div>

                          {activeDropdown === child.id && (
                            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3">
                              {child.children.map((grandChild) => (
                                <Link
                                  key={grandChild.id}
                                  href={grandChild.url || "#"}
                                  className="block py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                                  onClick={handleLinkClick}
                                >
                                  {grandChild.title}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={child.id}
                        href={child.url || "#"}
                        className="block px-4 py-3 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                        onClick={handleLinkClick}
                      >
                        {child.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      );
    } else {
      // Render regular menu item
      return (
        <Link
          key={menu.id}
          href={menu.url || "#"}
          className="nav-item px-3 py-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md"
          onClick={handleLinkClick}
        >
          {menu.title}
        </Link>
      );
    }
  };

  return (
    <nav className={`${className} website-nav relative`} ref={dropdownRef}>
      <div className="flex flex-wrap items-center space-x-1 lg:space-x-2">
        {menus.map(renderMenuItem)}
      </div>
    </nav>
  );
}

// Hook untuk menggunakan menu data
export function useWebsiteMenus() {
  const [menus, setMenus] = useState<MenuTreeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoading(true);
        const { data = [], success, message } = await getPublicWebsiteMenus();
        if (success) {
          setMenus(data);
        } else {
          setError(message || "Failed to fetch menus");
        }
      } catch (err) {
        setError("Error fetching menus");
        console.error("Error fetching menus:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return { menus, loading, error, refetch: () => window.location.reload() };
}
