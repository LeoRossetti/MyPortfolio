"use client";

import {
  useEffect,
  useRef,
  useState,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";

const CHAR_POOL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$&%*!?<>/";

const EVENT_NAME = "locale-scramble:start";

type Props<T extends ElementType> = {
  children: string;
  /** Wrapper tag. Defaults to `span` so it composes inside any parent. */
  as?: T;
  className?: string;
  /** Total scramble duration in ms. Default 700. */
  duration?: number;
} & Omit<ComponentPropsWithoutRef<T>, "children" | "className">;

/**
 * Wraps a translated string and plays a left-to-right "decoder" scramble
 * whenever a `locale-scramble:start` event fires on `window`. Reads the
 * latest prop value at each animation frame, so it naturally settles on
 * the post-swap text even though the scramble starts before/during the
 * dictionary swap.
 *
 * Respects `prefers-reduced-motion` — under reduced motion the text just
 * snaps to the new value.
 */
export function Scramble<T extends ElementType = "span">({
  children,
  as,
  className,
  duration = 700,
  ...rest
}: Props<T>) {
  const Tag = (as ?? "span") as ElementType;

  const [display, setDisplay] = useState(children);
  const target = useRef(children);
  const animating = useRef(false);

  // Keep `target` current. If we're not mid-animation, mirror the new
  // value into `display` immediately so initial renders / non-scramble
  // changes still update text.
  useEffect(() => {
    target.current = children;
    if (!animating.current) setDisplay(children);
  }, [children]);

  useEffect(() => {
    const onScramble = () => {
      if (typeof window === "undefined") return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setDisplay(target.current);
        return;
      }
      animating.current = true;
      const start = performance.now();
      let raf = 0;

      const tick = (now: number) => {
        const t = target.current;
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const len = t.length;
        const out = new Array(len);
        const denom = Math.max(len - 1, 1);

        for (let i = 0; i < len; i++) {
          const ch = t[i];
          // Preserve whitespace so word boundaries stay visible during the
          // scramble — otherwise it reads as one long string of garbage.
          if (ch === " " || ch === "\n" || ch === "\t") {
            out[i] = ch;
            continue;
          }
          // Each character has its own settle threshold based on index
          // (left settles first), with a small ramp so the right edge
          // still has time to scramble before the end.
          const settleAt = (i / denom) * 0.78 + 0.18;
          if (progress >= settleAt) {
            out[i] = ch;
          } else {
            out[i] = CHAR_POOL[(Math.random() * CHAR_POOL.length) | 0];
          }
        }
        setDisplay(out.join(""));

        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setDisplay(t);
          animating.current = false;
        }
      };

      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    window.addEventListener(EVENT_NAME, onScramble);
    return () => window.removeEventListener(EVENT_NAME, onScramble);
  }, [duration]);

  return (
    <Tag className={className} {...rest}>
      {display}
    </Tag>
  );
}

export function dispatchLocaleScramble() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_NAME));
}
