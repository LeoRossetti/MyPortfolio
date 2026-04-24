/**
 * Hairline divider used between content sections. Uses an outer flex
 * container with `justify-center` instead of `mx-auto` on the line
 * itself — `mx-auto` inside a `flex flex-col` (which <main> is) can
 * fail to center at very wide viewports when siblings create stacking
 * contexts. Flex centering is invariant to sibling layout.
 */
export function SectionDivider() {
  return (
    <div
      aria-hidden
      className="relative z-10 flex w-full justify-center px-6 lg:px-10"
    >
      <div
        className="h-px w-full max-w-5xl"
        style={{
          backgroundImage:
            "linear-gradient(to right, transparent, rgba(255,255,255,0.28), transparent)",
        }}
      />
    </div>
  );
}
