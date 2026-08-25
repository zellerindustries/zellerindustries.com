export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let t: number;
  return (...args: Parameters<T>) => {
    clearTimeout(t);
    t = window.setTimeout(() => fn(...args), delay);
  };
}

export function sanitize(s: string): string {
  const t = document.createElement("div");
  t.textContent = s;
  return t.innerHTML;
}
