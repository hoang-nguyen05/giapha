import '../../styles/parchment.css';

interface FamilyHeaderProps {
  title: string;
}

export default function FamilyHeader({ title }: FamilyHeaderProps) {
  return (
    <div className="header-banner">
      <div className="header-banner-inner">
        <span className="header-deco-left">✦</span>
        <h1 className="header-title">{title}</h1>
        <span className="header-deco-right">✦</span>
      </div>
    </div>
  );
}
