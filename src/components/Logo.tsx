interface LogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

export default function Logo({ className = '' }: LogoProps) {

  return (
    <div 
      className={`relative ${className}`}
      style={{ 
        margin: 0, 
        padding: 0,
        lineHeight: 0,
        display: 'inline-block',
        verticalAlign: 'top'
      }}
    >
      {/* Logo image - natural size, no forced dimensions */}
      <img
        src="/Dryft/logo-dryft.png"
        alt="DRYFT"
        className="relative z-10 drop-shadow-2xl"
        style={{
          filter: 'drop-shadow(0 0 30px rgba(99, 102, 241, 0.3))',
          margin: 0,
          padding: 0,
          display: 'block',
          verticalAlign: 'top',
          lineHeight: 0,
          width: 'auto',
          height: 'auto',
        }}
      />
    </div>
  );
}
