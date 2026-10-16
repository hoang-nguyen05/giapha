import { Handle, Position } from 'reactflow';
import type { Person } from '../../models/Person';
import { useUIStore } from '../../store/uiStore';
import { Plus, Edit2, Info } from 'lucide-react';
import './FamilyNode.css';

interface FamilyNodeProps {
  data: {
    person: Person;
  };
  selected?: boolean;
}

export default function FamilyNode({ data, selected }: FamilyNodeProps) {
  const { person } = data;
  const { 
    selectedPerson, 
    highlightedPersonId, 
    openDetailPanel, 
    openEditModal, 
    openAddModal 
  } = useUIStore();

  const isHighlighted = highlightedPersonId === person.id;
  const isSelected = selected || selectedPerson?.id === person.id;
  const typeClass = `node-type-${person.type || 'main'}`;

  const handleQuickAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    openAddModal(person.id);
  };

  const handleQuickEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    openEditModal(person);
  };

  const handleQuickDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDetailPanel(person);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openDetailPanel(person);
  };

  // Build year or status string
  const getYearsText = () => {
    if (person.birthYear && person.deathYear) {
      return `${person.birthYear} - ${person.deathYear}`;
    }
    if (person.birthYear) {
      return `Sinh ${person.birthYear}`;
    }
    if (person.deathYear) {
      return `Mất ${person.deathYear}`;
    }
    return null;
  };

  const yearsText = getYearsText();

  return (
    <div 
      className={`family-node ${typeClass} ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
      onClick={handleCardClick}
      title="Click để xem chi tiết / Nhấp chuột phải để mở menu"
    >
      <Handle type="target" position={Position.Top} className="handle-target" />

      {/* Floating Hover Actions */}
      <div className="node-hover-actions">
        <button 
          className="node-action-btn" 
          onClick={handleQuickAddChild} 
          title="Thêm con"
          aria-label="Thêm con"
        >
          <Plus size={11} />
        </button>
        <button 
          className="node-action-btn" 
          onClick={handleQuickEdit} 
          title="Sửa thông tin"
          aria-label="Sửa thông tin"
        >
          <Edit2 size={10} />
        </button>
        <button 
          className="node-action-btn" 
          onClick={handleQuickDetail} 
          title="Xem hồ sơ"
          aria-label="Xem hồ sơ"
        >
          <Info size={11} />
        </button>
      </div>

      {/* Generation Tag Badge */}
      {person.generation && (
        <div className="node-gen-badge">
          Đời {person.generation}
        </div>
      )}

      {/* 4 Corner Ornaments */}
      <div className="corner-tl" />
      <div className="corner-tr" />
      <div className="corner-bl" />
      <div className="corner-br" />

      <div className="node-content">
        <div className="node-header-row">
          <span className="node-name">{person.name}</span>
        </div>

        {yearsText && (
          <div className="node-years">{yearsText}</div>
        )}

        {person.note && !yearsText && (
          <div className="node-note" title={person.note}>{person.note}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="handle-source" />
    </div>
  );
}
