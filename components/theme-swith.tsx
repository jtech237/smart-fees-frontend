import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { FC, useEffect, useState } from "react";
import Switch from "react-switch";

export const ThemeSwitch: FC = () => {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false)
  const handleChange = () => {
    if (theme === "system") {
      if (resolvedTheme === "light") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    } else {
      if (theme === "light") {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  };

  useEffect(() => {
    setMounted(true)
  }, [])

  if(!mounted) {
    return null
  }

  return (
    <label>
      <span className="sr-only">Toggle theme</span>
      <Switch
        checked={resolvedTheme === "dark"}
        onChange={handleChange}
        uncheckedIcon={<Sun />}
        checkedIcon={<Moon />}
        className="bg-black"
      />
    </label>
  );
};
