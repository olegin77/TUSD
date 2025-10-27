import { motion, type Variants } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const listVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
};

export function AnimatedList({ children, className, staggerDelay = 0.1 }: AnimatedListProps) {
  return (
    <motion.div variants={listVariants} initial="hidden" animate="visible" className={className}>
      {Array.isArray(children) ? (
        children.map((child, index) => (
          <motion.div key={index} variants={itemVariants}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={itemVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

// Animated counter component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

export function AnimatedCounter({ value, duration = 2, className }: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration }}>
        {value.toLocaleString()}
      </motion.span>
    </motion.span>
  );
}

// Animated progress bar
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export function AnimatedProgress({ value, max = 100, className }: AnimatedProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <motion.div
        className="bg-blue-600 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
}
