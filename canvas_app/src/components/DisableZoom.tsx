import { useEffect } from 'react';

function DisableZoom() {
  useEffect(() => {
    const handleWheel = (e: any) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: any) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '=')
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners when the component mounts
    window.addEventListener('wheel', handleWheel, { passive: false } as any);
    window.addEventListener('keydown', handleKeyDown);

    // Clean up by removing event listeners when the component unmounts
    return () => {
      window.removeEventListener('wheel', handleWheel, {
        passive: false,
      } as any);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null;
}

export default DisableZoom;
