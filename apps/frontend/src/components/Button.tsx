import { cn } from '../utils/cn';

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'warning' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
}

export const Button = ({
    children,
    onClick,
    className = '',
    variant = 'primary',
    size = 'md',
    disabled = false
}: ButtonProps) => {
    const baseStyles = 'font-semibold rounded-lg transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bgMain disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg';
    
    const variantStyles = {
        primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white border border-blue-500 hover:border-blue-400 focus:ring-blue-500/50 shadow-blue-900/25',
        secondary: 'bg-gradient-to-r from-surfaceDark to-surfaceLight hover:from-surfaceLight hover:to-blue-800 text-blue-300 border border-borderColor hover:border-blue-500 focus:ring-blue-500/50 shadow-slate-900/25',
        outline: 'bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:border-blue-400 hover:text-blue-300 focus:ring-blue-500/50',
        ghost: 'bg-transparent text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 focus:ring-blue-500/50',
        success: 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white border border-emerald-500 focus:ring-emerald-500/50 shadow-emerald-900/25',
        warning: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white border border-amber-500 focus:ring-amber-500/50 shadow-amber-900/25',
        danger: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border border-red-500 focus:ring-red-500/50 shadow-red-900/25'
    };
    
    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg'
    };
    
    return (
        <button 
            className={cn(
                baseStyles,
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};