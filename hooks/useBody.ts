import { useEffect, useState } from "react";

export function useBody() {
  const [body, setBody] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setBody(document.body);
  }, []);

  return body;
}
