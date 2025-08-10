  import
  
  function PreviewScaler({ children }: { children: React.ReactNode }) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;     // 현재 가용 폭
      const next = Math.min(1, w / 640);     // 640 기준으로 축소(초과하면 1배)
      setScale(next);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="w-full max-w-full overflow-auto flex justify-center touch-pan-y"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      <div
        style={{
          width: 640,
          height: 640,
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {children}
      </div>
    </div>
  );
}