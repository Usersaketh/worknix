import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [mode, setMode] = useState<'light'|'dark'>(() => (localStorage.getItem('worknix_theme') as 'light'|'dark') || 'light');
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'dark') root.classList.add('dark'); else root.classList.remove('dark');
    localStorage.setItem('worknix_theme', mode);
  }, [mode]);
  return (
    <Button variant="outline" size="sm" aria-label="Toggle theme" onClick={()=>setMode(m=> m==='light' ? 'dark':'light')} className="flex items-center gap-2">
      {mode === 'light' ? (<><Moon className="h-4 w-4" /><span>Dark</span></>) : (<><Sun className="h-4 w-4" /><span>Light</span></>)}
    </Button>
  );
}