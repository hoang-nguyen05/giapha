import { useState, useEffect } from 'react';
import { useUIStore } from '../../store/uiStore';
import { useFamilyStore } from '../../store/familyStore';
import type { Person, PersonType } from '../../models/Person';
import { 
  X, 
  User, 
  Plus, 
  Edit2, 
  Trash2, 
  Navigation, 
  FileText, 
  Users, 
  Sparkles,
  Heart,
  BarChart3
} from 'lucide-react';
import { useReactFlow } from 'reactflow';
import './Modals.css';

// Reusable Modal Backdrop
function ModalOverlay({ children, onClose, maxWidth = '460px' }: { children: React.ReactNode; onClose: () => void; maxWidth?: string }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-container" 
        style={{ maxWidth }} 
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// Color Swatches Configuration
const COLOR_OPTIONS: { type: PersonType; label: string; color: string; bg: string }[] = [
  { type: 'main', label: 'Bạch Ngọc (Chính)', color: '#B8860B', bg: '#FFFDF9' },
  { type: 'blue', label: 'Lam Ngọc (Chi 1)', color: '#4A90E2', bg: '#F0F6FC' },
  { type: 'green', label: 'Thanh Ngọc (Chi 2)', color: '#48BB78', bg: '#F2F8F2' },
  { type: 'red', label: 'Chu Sa (Chi 3)', color: '#E53E3E', bg: '#FDF2F2' },
  { type: 'gold', label: 'Hoàng Kim (Chi 4)', color: '#D4AF37', bg: '#FEFBF0' },
];

export function AddPersonModal() {
  const { isAddModalOpen, closeModals, targetParentId, showToast, setHighlightedPersonId } = useUIStore();
  const { people, addPerson, addRelationship } = useFamilyStore();
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [type, setType] = useState<PersonType>('blue');
  const [generation, setGeneration] = useState<number>(1);
  const [parentId, setParentId] = useState<string>('');
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [note, setNote] = useState('');

  // Auto calculate generation based on selected parent
  useEffect(() => {
    if (targetParentId) {
      setParentId(targetParentId);
      const parent = people.find(p => p.id === targetParentId);
      if (parent) {
        setGeneration((parent.generation || 1) + 1);
        setType(parent.type || 'blue');
      }
    } else {
      setParentId('');
      setGeneration(1);
      setType('main');
    }
  }, [targetParentId, people, isAddModalOpen]);

  if (!isAddModalOpen) return null;

  const handleParentChange = (newParentId: string) => {
    setParentId(newParentId);
    if (newParentId) {
      const parent = people.find(p => p.id === newParentId);
      if (parent) {
        setGeneration((parent.generation || 1) + 1);
        setType(parent.type || 'blue');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newPerson = addPerson({
      name: name.trim(),
      gender,
      type,
      generation: Number(generation) || 1,
      birthYear: birthYear.trim() || null,
      deathYear: deathYear.trim() || null,
      note: note.trim(),
    });

    if (parentId) {
      addRelationship({
        type: 'parent-child',
        sourceId: parentId,
        targetId: newPerson.id
      });
    }

    setHighlightedPersonId(newPerson.id);
    showToast(`Đã thêm thành viên: ${newPerson.name}`, 'success');
    closeModals();
  };

  return (
    <ModalOverlay onClose={closeModals}>
      <div className="modal-header">
        <div className="modal-title-row">
          <div className="modal-badge-icon"><Plus size={16} /></div>
          <h2>THÊM THÀNH VIÊN VÀO PHẢ ĐỒ</h2>
        </div>
        <button className="modal-close-btn" onClick={closeModals}><X size={18} /></button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form-body">
        <div className="form-group">
          <label className="form-label">Họ và tên *</label>
          <input 
            autoFocus 
            className="form-input text-lg" 
            placeholder="VD: Nguyễn Đắc Canh" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <div className="gender-btn-group">
              <button 
                type="button" 
                className={`gender-btn ${gender === 'male' ? 'active-male' : ''}`}
                onClick={() => setGender('male')}
              >
                Nam
              </button>
              <button 
                type="button" 
                className={`gender-btn ${gender === 'female' ? 'active-female' : ''}`}
                onClick={() => setGender('female')}
              >
                Nữ
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thế hệ (Đời thứ)</label>
            <input 
              type="number" 
              className="form-input" 
              min={1} 
              max={30} 
              value={generation} 
              onChange={e => setGeneration(Number(e.target.value))} 
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Trực thuộc con của ai?</label>
          <select 
            className="form-select" 
            value={parentId} 
            onChange={e => handleParentChange(e.target.value)}
          >
            <option value="">-- Là Thủy tổ / Người đứng đầu (Không có cha mẹ) --</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Đời {p.generation}) {p.birthYear ? `• ${p.birthYear}` : ''}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Năm sinh</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: 1952" 
              value={birthYear} 
              onChange={e => setBirthYear(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Năm mất (nếu có)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: 2018" 
              value={deathYear} 
              onChange={e => setDeathYear(e.target.value)} 
            />
          </div>
        </div>

        {/* Visual Color Swatches */}
        <div className="form-group">
          <label className="form-label">Màu thẻ hiển thị (Phân biệt Chi / Nhánh)</label>
          <div className="color-swatches-grid">
            {COLOR_OPTIONS.map(opt => (
              <div 
                key={opt.type} 
                className={`swatch-card ${type === opt.type ? 'selected' : ''}`}
                style={{ borderColor: type === opt.type ? opt.color : 'rgba(0,0,0,0.1)' }}
                onClick={() => setType(opt.type)}
              >
                <span className="swatch-indicator" style={{ backgroundColor: opt.color }} />
                <span className="swatch-label">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú / Mộ phần / Chức sắc</label>
          <textarea 
            className="form-textarea" 
            placeholder="Nơi an nghỉ, tước hiệu, sự tích, thông tin phối ngẫu..." 
            value={note} 
            onChange={e => setNote(e.target.value)} 
            rows={2} 
          />
        </div>

        <div className="modal-actions-footer">
          <button type="button" className="btn-modal-secondary" onClick={closeModals}>Hủy</button>
          <button type="submit" className="btn-modal-primary">Lưu Thành Viên</button>
        </div>
      </form>
    </ModalOverlay>
  );
}

export function EditPersonModal() {
  const { isEditModalOpen, closeModals, selectedPerson, showToast } = useUIStore();
  const { updatePerson, removePerson } = useFamilyStore();
  
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male');
  const [type, setType] = useState<PersonType>('blue');
  const [generation, setGeneration] = useState<number>(1);
  const [birthYear, setBirthYear] = useState('');
  const [deathYear, setDeathYear] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (selectedPerson) {
      setName(selectedPerson.name);
      setGender(selectedPerson.gender);
      setType(selectedPerson.type || 'main');
      setGeneration(selectedPerson.generation || 1);
      setBirthYear(selectedPerson.birthYear || '');
      setDeathYear(selectedPerson.deathYear || '');
      setNote(selectedPerson.note || '');
    }
  }, [selectedPerson]);

  if (!isEditModalOpen || !selectedPerson) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updatePerson(selectedPerson.id, {
      name: name.trim(),
      gender,
      type,
      generation: Number(generation) || 1,
      birthYear: birthYear.trim() || null,
      deathYear: deathYear.trim() || null,
      note: note.trim(),
    });

    showToast(`Đã cập nhật thông tin: ${name}`, 'success');
    closeModals();
  };

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${selectedPerson.name}" khỏi gia phả?`)) {
      removePerson(selectedPerson.id);
      showToast(`Đã xóa: ${selectedPerson.name}`, 'warning');
      closeModals();
    }
  };

  return (
    <ModalOverlay onClose={closeModals}>
      <div className="modal-header">
        <div className="modal-title-row">
          <div className="modal-badge-icon edit"><Edit2 size={16} /></div>
          <h2>CHỈNH SỬA THÔNG TIN THÀNH VIÊN</h2>
        </div>
        <button className="modal-close-btn" onClick={closeModals}><X size={18} /></button>
      </div>

      <form onSubmit={handleSubmit} className="modal-form-body">
        <div className="form-group">
          <label className="form-label">Họ và tên *</label>
          <input 
            autoFocus 
            className="form-input text-lg" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Giới tính</label>
            <div className="gender-btn-group">
              <button 
                type="button" 
                className={`gender-btn ${gender === 'male' ? 'active-male' : ''}`}
                onClick={() => setGender('male')}
              >
                Nam
              </button>
              <button 
                type="button" 
                className={`gender-btn ${gender === 'female' ? 'active-female' : ''}`}
                onClick={() => setGender('female')}
              >
                Nữ
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Thế hệ (Đời thứ)</label>
            <input 
              type="number" 
              className="form-input" 
              min={1} 
              max={30} 
              value={generation} 
              onChange={e => setGeneration(Number(e.target.value))} 
            />
          </div>
        </div>

        <div className="form-row-2">
          <div className="form-group">
            <label className="form-label">Năm sinh</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: 1952" 
              value={birthYear} 
              onChange={e => setBirthYear(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Năm mất (nếu có)</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="VD: 2018" 
              value={deathYear} 
              onChange={e => setDeathYear(e.target.value)} 
            />
          </div>
        </div>

        {/* Visual Color Swatches */}
        <div className="form-group">
          <label className="form-label">Màu thẻ hiển thị</label>
          <div className="color-swatches-grid">
            {COLOR_OPTIONS.map(opt => (
              <div 
                key={opt.type} 
                className={`swatch-card ${type === opt.type ? 'selected' : ''}`}
                style={{ borderColor: type === opt.type ? opt.color : 'rgba(0,0,0,0.1)' }}
                onClick={() => setType(opt.type)}
              >
                <span className="swatch-indicator" style={{ backgroundColor: opt.color }} />
                <span className="swatch-label">{opt.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú / Mộ phần / Tiểu sử</label>
          <textarea 
            className="form-textarea" 
            value={note} 
            onChange={e => setNote(e.target.value)} 
            rows={2} 
          />
        </div>

        <div className="modal-actions-footer space-between">
          <button type="button" className="btn-modal-danger" onClick={handleDelete}>
            <Trash2 size={14} /> Xóa người này
          </button>
          <div className="footer-right-buttons">
            <button type="button" className="btn-modal-secondary" onClick={closeModals}>Hủy</button>
            <button type="submit" className="btn-modal-primary">Lưu Thay Đổi</button>
          </div>
        </div>
      </form>
    </ModalOverlay>
  );
}

// Pro Sliding Inspector Drawer (Replaces old DetailPanel)
export function DetailPanel() {
  const { isDetailPanelOpen, closeModals, selectedPerson, openAddModal, openEditModal, setHighlightedPersonId, showToast } = useUIStore();
  const { relationships, people, removePerson } = useFamilyStore();
  const { setCenter, getNodes } = useReactFlow();

  if (!isDetailPanelOpen || !selectedPerson) return null;

  // Fly to node on canvas
  const handleFlyTo = (targetPerson: Person) => {
    const nodes = getNodes();
    const node = nodes.find(n => n.id === targetPerson.id);
    if (node) {
      setCenter(node.position.x + 66, node.position.y + 25, { zoom: 1.4, duration: 700 });
      setHighlightedPersonId(targetPerson.id);
      showToast(`Đã định vị: ${targetPerson.name}`, 'info');
    }
  };

  // Find parents
  const parentRels = relationships.filter(r => r.targetId === selectedPerson.id && r.type === 'parent-child');
  const parents = parentRels.map(r => people.find(p => p.id === r.sourceId)).filter(Boolean) as Person[];

  // Find children
  const childRels = relationships.filter(r => r.sourceId === selectedPerson.id && r.type === 'parent-child');
  const children = childRels.map(r => people.find(p => p.id === r.targetId)).filter(Boolean) as Person[];

  // Calculate age / lifespan
  let lifespanText = null;
  if (selectedPerson.birthYear && selectedPerson.deathYear) {
    const b = parseInt(selectedPerson.birthYear);
    const d = parseInt(selectedPerson.deathYear);
    if (!isNaN(b) && !isNaN(d) && d >= b) {
      lifespanText = `Hưởng thọ ${d - b + 1} tuổi (${b} - ${d})`;
    }
  }

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa "${selectedPerson.name}" khỏi gia phả?`)) {
      removePerson(selectedPerson.id);
      showToast(`Đã xóa: ${selectedPerson.name}`, 'warning');
      closeModals();
    }
  };

  return (
    <aside className="pro-detail-drawer">
      {/* Drawer Top Header */}
      <div className="drawer-header">
        <div className="drawer-title-group">
          <Sparkles size={16} className="text-gold" />
          <span>HỒ SƠ THÀNH VIÊN</span>
        </div>
        <button className="drawer-close-btn" onClick={closeModals} title="Đóng bảng">
          <X size={18} />
        </button>
      </div>

      <div className="drawer-body">
        {/* Profile Card Banner */}
        <div className={`drawer-profile-card card-${selectedPerson.type || 'main'}`}>
          <div className="profile-avatar-circle">
            <User size={28} />
          </div>

          <h3 className="profile-full-name">{selectedPerson.name}</h3>

          <div className="profile-tag-badges">
            <span className="badge-gen">Đời thứ {selectedPerson.generation || '?'}</span>
            <span className="badge-gender">
              {selectedPerson.gender === 'male' ? 'Nam giới' : selectedPerson.gender === 'female' ? 'Nữ giới' : 'Khác'}
            </span>
          </div>

          {lifespanText ? (
            <div className="profile-lifespan">{lifespanText}</div>
          ) : (selectedPerson.birthYear || selectedPerson.deathYear) ? (
            <div className="profile-lifespan">
              {selectedPerson.birthYear ? `Sinh: ${selectedPerson.birthYear}` : ''} 
              {selectedPerson.birthYear && selectedPerson.deathYear ? ' • ' : ''}
              {selectedPerson.deathYear ? `Mất: ${selectedPerson.deathYear}` : ''}
            </div>
          ) : null}
        </div>

        {/* Quick Drawer Action Bar */}
        <div className="drawer-action-bar">
          <button 
            className="drawer-action-btn primary"
            onClick={() => openAddModal(selectedPerson.id)}
            title="Thêm con cho người này"
          >
            <Plus size={15} /> Thêm Con
          </button>

          <button 
            className="drawer-action-btn"
            onClick={() => openEditModal(selectedPerson)}
            title="Chỉnh sửa thông tin"
          >
            <Edit2 size={14} /> Chỉnh Sửa
          </button>

          <button 
            className="drawer-action-btn"
            onClick={() => handleFlyTo(selectedPerson)}
            title="Định vị trên sơ đồ"
          >
            <Navigation size={14} /> Định Vị
          </button>
        </div>

        {/* Note / Biography */}
        {selectedPerson.note && (
          <div className="drawer-section">
            <div className="section-title">
              <FileText size={14} />
              <span>Ghi Chú & Tiểu Sử</span>
            </div>
            <div className="section-note-box">
              {selectedPerson.note}
            </div>
          </div>
        )}

        {/* Interactive Pedigree: Parents */}
        <div className="drawer-section">
          <div className="section-title">
            <Heart size={14} />
            <span>Đấng Sinh Thành ({parents.length})</span>
          </div>
          {parents.length > 0 ? (
            <div className="relative-cards-list">
              {parents.map(parent => (
                <div 
                  key={parent.id} 
                  className="relative-node-card"
                  onClick={() => handleFlyTo(parent)}
                  title="Bấm để bay đến vị trí trên sơ đồ"
                >
                  <div className={`relative-card-dot dot-${parent.type || 'main'}`} />
                  <div className="relative-card-info">
                    <span className="relative-card-name">{parent.name}</span>
                    <span className="relative-card-sub">Đời {parent.generation}</span>
                  </div>
                  <Navigation size={13} className="relative-nav-icon" />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-relative-hint">Là Thủy tổ / Tiền bối đầu dòng họ</div>
          )}
        </div>

        {/* Interactive Pedigree: Children */}
        <div className="drawer-section">
          <div className="section-title">
            <Users size={14} />
            <span>Hậu Duệ Trực Hệ ({children.length})</span>
          </div>
          {children.length > 0 ? (
            <div className="relative-cards-list">
              {children.map(child => (
                <div 
                  key={child.id} 
                  className="relative-node-card"
                  onClick={() => handleFlyTo(child)}
                  title="Bấm để bay đến vị trí trên sơ đồ"
                >
                  <div className={`relative-card-dot dot-${child.type || 'main'}`} />
                  <div className="relative-card-info">
                    <span className="relative-card-name">{child.name}</span>
                    <span className="relative-card-sub">
                      Đời {child.generation} {child.birthYear ? `(${child.birthYear})` : ''}
                    </span>
                  </div>
                  <Navigation size={13} className="relative-nav-icon" />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-relative-hint">Chưa có thông tin con cái trong phả đồ</div>
          )}
        </div>

        {/* Delete Person Action */}
        <div className="drawer-footer-danger">
          <button className="btn-drawer-delete" onClick={handleDelete}>
            <Trash2 size={14} /> Xóa người này khỏi phả đồ
          </button>
        </div>
      </div>
    </aside>
  );
}

// Pro Family Stats Modal
export function StatsModal() {
  const { isStatsModalOpen, closeStatsModal } = useUIStore();
  const { people, settings } = useFamilyStore();

  if (!isStatsModalOpen) return null;

  const totalMembers = people.length;
  const males = people.filter(p => p.gender === 'male').length;
  const females = people.filter(p => p.gender === 'female').length;

  const generations = Array.from(new Set(people.map(p => p.generation).filter(Boolean))).sort((a, b) => a - b);
  const maxGen = generations.length > 0 ? Math.max(...generations) : 0;

  // Count by color branches
  const branches = {
    main: people.filter(p => p.type === 'main' || !p.type).length,
    blue: people.filter(p => p.type === 'blue').length,
    green: people.filter(p => p.type === 'green').length,
    red: people.filter(p => p.type === 'red').length,
    gold: people.filter(p => p.type === 'gold').length,
  };

  return (
    <ModalOverlay onClose={closeStatsModal} maxWidth="560px">
      <div className="modal-header">
        <div className="modal-title-row">
          <div className="modal-badge-icon"><BarChart3 size={16} /></div>
          <h2>BẢNG THỐNG KÊ TOÀN CẢNH DÒNG HỌ</h2>
        </div>
        <button className="modal-close-btn" onClick={closeStatsModal}><X size={18} /></button>
      </div>

      <div className="modal-form-body stats-body">
        <div className="stats-highlight-banner">
          <div className="highlight-title">{settings.title || 'GIA PHẢ ĐẠI TỘC'}</div>
          <div className="highlight-subtitle">Cội nguồn truyền thống • Vạn thế lưu phương</div>
        </div>

        <div className="stats-kpi-grid">
          <div className="kpi-card">
            <span className="kpi-num">{maxGen}</span>
            <span className="kpi-label">Thế Hệ (Đời)</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{totalMembers}</span>
            <span className="kpi-label">Tổng Nhân Khẩu</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{males}</span>
            <span className="kpi-label">Đinh Nam</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-num">{females}</span>
            <span className="kpi-label">Nữ Giới</span>
          </div>
        </div>

        <div className="stats-section-block">
          <h4>Phân bố theo các Chi / Nhánh</h4>
          <div className="branch-stat-row">
            <span className="branch-color-tag dot-main">Bạch Ngọc (Trưởng chi & Gốc)</span>
            <span className="branch-count">{branches.main} thành viên</span>
          </div>
          <div className="branch-stat-row">
            <span className="branch-color-tag dot-blue">Lam Ngọc (Chi 1)</span>
            <span className="branch-count">{branches.blue} thành viên</span>
          </div>
          <div className="branch-stat-row">
            <span className="branch-color-tag dot-green">Thanh Ngọc (Chi 2)</span>
            <span className="branch-count">{branches.green} thành viên</span>
          </div>
          <div className="branch-stat-row">
            <span className="branch-color-tag dot-red">Chu Sa (Chi 3)</span>
            <span className="branch-count">{branches.red} thành viên</span>
          </div>
          <div className="branch-stat-row">
            <span className="branch-color-tag dot-gold">Hoàng Kim (Chi 4)</span>
            <span className="branch-count">{branches.gold} thành viên</span>
          </div>
        </div>

        <div className="modal-actions-footer">
          <button className="btn-modal-primary" onClick={closeStatsModal}>Đóng Bảng Thống Kê</button>
        </div>
      </div>
    </ModalOverlay>
  );
}
