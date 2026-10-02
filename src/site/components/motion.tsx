import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, useReducedMotion, type Transition } from "framer-motion";

// Transições reproduzidas dos "appear effects" do Framer original.
export const SPRING_REVEAL: Transition = { type: "spring", damping: 80, stiffness: 400, mass: 1 };
export const TWEEN_SECTION: Transition = { duration: 0.4, ease: [0.44, 0, 0.56, 1] };
export const SLIDE_IN: Transition = { delay: 0.4, duration: 1, ease: [0.12, 0.23, 0, 1] };
export const HOVER_SPRING: Transition = { type: "spring", bounce: 0.2, duration: 0.4 };

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** deslocamento inicial */
  y?: number;
  x?: number;
  /** opacidade inicial */
  opacity?: number;
  blur?: boolean;
  delay?: number;
  transition?: Transition;
  /** fração visível necessária para disparar (0–1) */
  amount?: number;
  as?: "div" | "section" | "li" | "span";
};

/** Entra na tela uma única vez, como os appear effects do Framer. */
export const Reveal = ({
  children,
  className,
  y = 40,
  x = 0,
  opacity = 0,
  blur = false,
  delay = 0,
  transition = SPRING_REVEAL,
  amount = 0,
  as = "div",
}: RevealProps) => {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  if (reduce) return <Comp className={className}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity, y, x, filter: blur ? "blur(10px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount }}
      transition={{ ...transition, delay: (transition.delay ?? 0) + delay }}
    >
      {children}
    </Comp>
  );
};

/** Título que surge palavra a palavra saindo do desfoque (efeito de texto do Framer). */
export const BlurText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  if (reduce) return <span className={className}>{text}</span>;
  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.06, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <Fragment key={`${w}-${i}`}>
          <motion.span
            aria-hidden="true"
            className="inline-block"
            variants={{
              hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
              visible: { opacity: 1, filter: "blur(0px)", y: 0 },
            }}
            transition={{ duration: 0.6, ease: [0.12, 0.23, 0, 1] }}
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
};

/** Contador animado (ex.: "+140 municípios atendidos"). */
export const CountUp = ({ to, duration = 2, className }: { to: number; duration?: number; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.12, 0.23, 0, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
    </span>
  );
};
