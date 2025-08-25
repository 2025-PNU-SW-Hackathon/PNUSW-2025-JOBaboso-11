interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
}

const Button = ({
  children,
  className = '',
  onClick,
  type = 'button',
  variant = 'primary',
}: ButtonProps) => {
  const baseClasses =
    'flex h-[42px] items-center justify-center gap-2 rounded-[12px] font-medium leading-none transition px-4';

  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-700 hover:bg-gray-300',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
