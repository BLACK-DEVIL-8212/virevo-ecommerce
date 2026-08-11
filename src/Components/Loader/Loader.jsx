import { useState, useEffect } from 'react';

function Loader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      const removeTimer = setTimeout(() => setMounted(false), 500);
      return () => clearTimeout(removeTimer);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className={`fixed inset-0 bg-white flex items-center justify-center z-[9999] transition-opacity duration-500 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="flex flex-col items-center gap-6">
        <div className="w-14 h-14 border-4 border-primary-light border-t-primary rounded-full animate-spin"></div>
        <span className="text-2xl font-extrabold text-primary tracking-[4px]">VIREVO</span>
      </div>
    </div>
  );
}

export default Loader;
