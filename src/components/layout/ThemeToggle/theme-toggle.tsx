'use client';

import { IconBrightness, IconMoon, IconSun } from '@tabler/icons-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch by only rendering after mount
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = resolvedTheme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      // Untuk mobile, langsung set theme tanpa animasi
      if (isMobile) {
        setTheme(newMode);
        // Force update meta theme-color untuk mobile
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
          metaThemeColor.setAttribute(
            'content',
            newMode === 'dark' ? '#0f172a' : '#ffffff'
          );
        }
        return;
      }

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [resolvedTheme, setTheme, isMobile]
  );

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button
        variant='secondary'
        size='icon'
        className='group/toggle size-8'
        disabled
        suppressHydrationWarning
      >
        <IconBrightness className="h-4 w-4" />
        <span className='sr-only'>Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant='secondary'
      size='icon'
      className='group/toggle size-8'
      onClick={handleThemeToggle}
    >
      {isMobile ? (
        resolvedTheme === 'dark' ? (
          <IconMoon className="h-4 w-4" />
        ) : (
          <IconSun className="h-4 w-4" />
        )
      ) : (
        <IconBrightness className="h-4 w-4" />
      )}
      <span className='sr-only'>Toggle theme</span>
    </Button>
  );
}
