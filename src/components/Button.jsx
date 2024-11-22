import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const getVariantClasses = (variant) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300",
    link: "bg-transparent underline-offset-4 hover:underline text-blue-600 dark:text-blue-400"
  };
  return variants[variant] || variants.primary;
};

const getSizeClasses = (size) => {
  const sizes = {
    sm: "text-sm px-3 py-1",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
    icon: "p-2"
  };
  return sizes[size] || sizes.md;
};

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  className = "",
  ...props
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const widthClasses = fullWidth ? "w-full" : "";

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${widthClasses} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      )}
      {!isLoading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
});

Button.propTypes = {
  // Required props
  children: PropTypes.node.isRequired,
  
  // Optional props with specific values
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'ghost',
    'link'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'icon']),
  
  // Boolean props
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  
  // Event handlers
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  
  // Icons
  leftIcon: PropTypes.element,
  rightIcon: PropTypes.element,
  
  // Styling
  className: PropTypes.string,
  
  // HTML button attributes
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  name: PropTypes.string,
  value: PropTypes.string,
  form: PropTypes.string,
  
  // ARIA attributes
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  'aria-controls': PropTypes.string,
  'aria-expanded': PropTypes.bool,
  'aria-pressed': PropTypes.bool,
  
  // Data attributes
  'data-testid': PropTypes.string,
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  fullWidth: false,
  isLoading: false,
  disabled: false,
  className: '',
  type: 'button'
};

Button.displayName = "Button";

export default Button;