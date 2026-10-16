import { useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useFamilyStore } from '../../store/familyStore';
import { Plus, Edit2, Trash2, Info, Navigation } from 'lucide-react';
import { useReactFlow } from 'reactflow';
import './ContextMenu.css';

export default function ContextMenu() {
  const { contextMenu, setContextMenu, openAddModal, openEditModal, openDetailPanel, setHighlightedPersonId, showToast } = useUIStore();
  const { people, removePerson } = useFamilyStore();
  const { setCenter, getNodes } = useReactFlow();

  useEffect(() => {
    const handleClickOutside = () => setContextMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [setContextMenu]);

  if (!contextMenu) return null;

  const person = people.find(p => p.id === contextMenu.personId);
  if (!person) return null;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Bạn có chắc muốn xóa: ${person.name}?`)) {
      removePerson(person.id);
      showToast(`Đã xóa: ${person.name}`, 'warning');
      setContextMenu(null);
    }
  };

  const handleFlyTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nodes = getNodes();
    const targetNode = nodes.find(n => n.id === person.id);
    if (targetNode) {
      setCenter(targetNode.position.x + 66, targetNode.position.y + 25, { zoom: 1.4, duration: 700 });
      setHighlightedPersonId(person.id);
      showToast(`Đã định vị: ${person.name}`, 'info');
    }
    setContextMenu(null);
  };

  return (
    <div 
      className="pro-context-menu"
      style={{ top: contextMenu.y, left: contextMenu.x }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="context-menu-header">
        <span className="context-menu-name">{person.name}</span>
        <span className="context-menu-gen">Đời {person.generation || '?'}</span>
      </div>

      <div className="context-menu-items">
        <button className="context-menu-item" onClick={() => { openDetailPanel(person); setContextMenu(null); }}>
          <Info size={14} className="icon-gold" />
          <span>Xem hồ sơ chi tiết</span>
        </button>

        <button className="context-menu-item" onClick={handleFlyTo}>
          <Navigation size={14} className="icon-gold" />
          <span>Định vị trên sơ đồ</span>
        </button>

        <button className="context-menu-item" onClick={() => { openAddModal(person.id); setContextMenu(null); }}>
          <Plus size={14} className="icon-gold" />
          <span>Thêm con</span>
        </button>

        <button className="context-menu-item" onClick={() => { openEditModal(person); setContextMenu(null); }}>
          <Edit2 size={14} />
          <span>Chỉnh sửa thông tin</span>
        </button>

        <div className="context-menu-divider" />

        <button className="context-menu-item text-danger" onClick={handleDelete}>
          <Trash2 size={14} />
          <span>Xóa thành viên</span>
        </button>
      </div>
    </div>
  );
}
