import { motion, type Variants } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface AnimatedIconProps {
  icon: LucideIcon;
  size?: number;
  className?: string;
  animate?: boolean;
  hover?: boolean;
}

const iconVariants: Variants = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17,
    },
  },
};

export function AnimatedIcon({ 
  icon: Icon, 
  size = 24, 
  className, 
  animate = true,
  hover = true 
}: AnimatedIconProps) {
  if (!animate) {
    return <Icon size={size} className={className} />;
  }

  return (
    <motion.div
      variants={iconVariants}
      initial="rest"
      whileHover={hover ? "hover" : "rest"}
      whileTap="tap"
    >
      <Icon size={size} className={className} />
    </motion.div>
  );
}

// Loading spinner with animation
export function AnimatedSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={`animate-spin ${className}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full" />
    </motion.div>
  );
}

// Pulse animation for loading states
export function PulseAnimation({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}