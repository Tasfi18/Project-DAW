import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'accent';
  delay?: number;
}

export const ServiceCard = ({ icon, title, description, color, delay = 0 }: ServiceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const gradients = {
    primary: 'from-emerald-500/20 to-teal-500/20',
    secondary: 'from-rose-500/20 to-pink-500/20',
    accent: 'from-amber-500/20 to-orange-500/20',
  };
  
  const glowColors = {
    primary: 'rgba(16, 185, 129, 0.4)',
    secondary: 'rgba(244, 63, 94, 0.4)',
    accent: 'rgba(251, 146, 60, 0.4)',
  };
  
  return (
    <Link to="/services" className="block h-full">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="relative group h-full"
      >      <div className="card relative p-6 sm:p-8 h-full overflow-hidden">
        {/* Animated Background */}
        <motion.div
          animate={{ 
            opacity: isHovered ? 1 : 0,
            scale: isHovered ? 1 : 0.8
          }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} rounded-2xl`}
        />
        
        {/* Glow Effect */}
        <motion.div
          animate={{ 
            opacity: isHovered ? 0.5 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 rounded-2xl"
          style={{
            boxShadow: `0 0 30px ${glowColors[color]}`,
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <motion.div
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6"
          >
            <div className={`w-full h-full bg-gradient-to-br ${gradients[color]} rounded-3xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg`}>
              {icon}
            </div>
          </motion.div>
          
          {/* Title */}
          <h3 className="text-xl sm:text-2xl font-bold text-dark mb-4 text-center">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-muted text-center leading-relaxed">
            {description}
          </p>
          
          {/* Interactive Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6 flex justify-center"
          >
            <span className={`text-${color} font-semibold flex items-center gap-2`}>
              Learn More
              <motion.svg
                animate={{ x: isHovered ? 5 : 0 }}
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </span>
          </motion.div>
        </div>
        
        {/* Corner Decoration */}
        <motion.div
          animate={{ 
            scale: isHovered ? 1 : 0,
            rotate: isHovered ? 45 : 0
          }}
          transition={{ duration: 0.3 }}
          className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${gradients[color]} rounded-xl opacity-50`}
        />
      </div>
    </motion.div>
    </Link>
  );
};