import React, { useState, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { 
  Download, 
  Upload, 
  Image as ImageIcon, 
  Plus, 
  ClipboardCopy, 
  Move, 
  GitMerge, 
  Trash2, 
  BarChart3, 
  Maximize2, 
  Minimize2, 
  MoreHorizontal, 
  RotateCcw,
  Sparkles,
  Pencil,
  Check
} from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import SearchBox from './SearchBox';
import './Toolbar.css';

export default function Toolbar() {
  const { 
    people, 
    relationships, 
    settings, 
    updateSettings, 
    importData, 
    layoutMode, 
    setLayoutMode, 
    initializePositions, 
    forceInitializePositions,
    resetToDemo
  } = useFamilyStore();
  
  const { openAddModal, openStatsModal, showToast } = useUIStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(settings.title || 'SƠ ĐỒ GIA PHẢ HỌ NGUYỄN ĐẮC');
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const { getNodes } = useReactFlow();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleSave = () => {
    if (tempTitle.trim()) {
      updateSettings({ title: tempTitle.trim() });
      showToast('Đã cập nhật tên dòng họ!', 'success');
    }
    setIsEditingTitle(false);
  };

  const handleExportPNG = async () => {
    setIsExporting(true);
    showToast('Đang tạo ảnh chất lượng cao...', 'info');
    try {
      const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
      if (!viewport) return;

      const POSTER_WIDTH = 1600;
      const POSTER_HEIGHT = 2400;

      const prevTransform = viewport.style.transform;
      viewport.style.transform = 'translate(0px, 0px) scale(1)';
      
      await new Promise(r => setTimeout(r, 120));

      const dataUrl = await toPng(viewport, {
        quality: 1,
        width: POSTER_WIDTH,
        height: POSTER_HEIGHT,
        pixelRatio: 2.5, // Ultra-high resolution
        style: {
          transform: 'translate(0px, 0px) scale(1)',
        },
        fetchRequestInit: { mode: 'no-cors' },
      });

      viewport.style.transform = prevTransform;

      const link = document.createElement('a');
      link.download = `gia-pha-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('🎉 Xuất ảnh PNG thành công!', 'success');
    } catch (err) {
      console.error('Export error:', err);
      showToast('Có lỗi xảy ra khi xuất ảnh', 'error');
    } finally {
      setIsExporting(false);
      setIsMenuOpen(false);
    }
  };

  const handleCopyText = async () => {
    try {
      const childIds = new Set(relationships.filter(r => r.type === 'parent-child').map(r => r.targetId));
      const rootPeople = people.filter(p => !childIds.has(p.id));

      let text = (settings.title || 'SƠ ĐỒ GIA PHẢ') + '\n\n';

      const buildTreeText = (personId: string, prefix: string, isLast: boolean) => {
        const person = people.find(p => p.id === personId);
        if (!person) return;
        
        text += `${prefix}${isLast ? '└── ' : '├── '}${person.name}${person.birthYear ? ` (${person.birthYear})` : ''}\n`;
        
        const childrenRels = relationships.filter(r => r.type === 'parent-child' && r.sourceId === personId);
        const children = childrenRels.map(r => people.find(p => p.id === r.targetId)).filter(Boolean);
        
        const nextPrefix = prefix + (isLast ? '    ' : '│   ');
        
        children.forEach((c, index) => {
          if (c) buildTreeText(c.id, nextPrefix, index === children.length - 1);
        });
      };

      rootPeople.forEach((p, index) => {
        text += `${p.name}\n`;
        const childrenRels = relationships.filter(r => r.type === 'parent-child' && r.sourceId === p.id);
        const children = childrenRels.map(r => people.find(p => p.id === r.targetId)).filter(Boolean);
        
        children.forEach((c, cIndex) => {
          if (c) buildTreeText(c.id, '', cIndex === children.length - 1);
        });
        
        if (index < rootPeople.length - 1) text += '\n';
      });

      await navigator.clipboard.writeText(text);
      showToast('📋 Đã sao chép phả hệ văn bản vào bộ nhớ tạm!', 'success');
    } catch (err) {
      console.error('Lỗi khi copy:', err);
      showToast('Không thể copy văn bản', 'error');
    } finally {
      setIsMenuOpen(false);
    }
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ people, relationships, settings }, null, 2);
    const uri = 'data:application/json;charset=utf-8,' + encodeURIComponent(data);
    const a = document.createElement('a');
    a.setAttribute('href', uri);
    a.setAttribute('download', `gia-pha-data-${Date.now()}.json`);
    a.click();
    showToast('💾 Đã xuất file JSON thành công!', 'success');
    setIsMenuOpen(false);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        if (data.people && data.relationships) {
          importData(data);
          showToast('📥 Nhập dữ liệu thành công!', 'success');
        } else {
          showToast('Dữ liệu gia phả không hợp lệ', 'error');
        }
      } catch {
        showToast('File JSON không hợp lệ', 'error');
      }
    };
    e.target.value = '';
    setIsMenuOpen(false);
  };

  const handleToggleLayout = () => {
    if (layoutMode === 'auto') {
      initializePositions(getNodes());
      setLayoutMode('manual');
      showToast('Chuyển sang chế độ Kéo thả tự do', 'info');
    } else {
      setLayoutMode('auto');
      showToast('Chuyển sang chế độ Tự động căn chỉnh', 'info');
    }
  };

  const handleResetLayout = () => {
    if (window.confirm('Bạn có chắc muốn làm mới toàn bộ vị trí kéo thả về tự động không?')) {
      setLayoutMode('auto');
      setTimeout(() => {
        forceInitializePositions(getNodes());
        setLayoutMode('manual');
        showToast('Đã làm mới bố cục cây', 'success');
      }, 50);
    }
    setIsMenuOpen(false);
  };

  const handleResetDemo = () => {
    if (window.confirm('Khôi phục dữ liệu gốc mẫu của dòng họ? Các thay đổi chưa lưu file sẽ mất.')) {
      resetToDemo();
      showToast('Đã khôi phục dữ liệu phả hệ gốc!', 'success');
    }
    setIsMenuOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
    setIsMenuOpen(false);
  };

  // Calculate quick stats
  const generations = Array.from(new Set(people.map(p => p.generation).filter(Boolean)));
  const maxGen = generations.length > 0 ? Math.max(...generations) : 0;

  return (
    <header className="pro-header-bar">
      {/* Left: Brand, Title & Stats */}
      <div className="header-left">
        <div className="brand-crest" title="Gia Phả Đại Tộc">
          <Sparkles size={18} className="crest-icon" />
        </div>

        <div className="title-container">
          {isEditingTitle ? (
            <div className="title-edit-box">
              <input 
                type="text" 
                value={tempTitle}
                autoFocus
                onChange={e => setTempTitle(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleTitleSave();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
              />
              <button onClick={handleTitleSave} className="title-action-btn check" title="Lưu">
                <Check size={14} />
              </button>
            </div>
          ) : (
            <div className="title-display-box" onClick={() => setIsEditingTitle(true)} title="Nhấp để đổi tên">
              <h1 className="header-title-text">{settings.title || 'SƠ ĐỒ GIA PHẢ HỌ NGUYỄN ĐẮC'}</h1>
              <Pencil size={12} className="title-pencil-icon" />
            </div>
          )}

          <div className="header-stats-pill" onClick={openStatsModal} title="Bấm để xem thống kê toàn diện">
            <span className="stat-item"><strong>{maxGen}</strong> Đời</span>
            <span className="stat-divider">•</span>
            <span className="stat-item"><strong>{people.length}</strong> Người</span>
            <BarChart3 size={11} className="stat-icon" />
          </div>
        </div>
      </div>

      {/* Center: Spotlight Search */}
      <div className="header-center">
        <SearchBox />
      </div>

      {/* Right: Actions & Tools */}
      <div className="header-right">
        {/* Primary Action Button */}
        <button 
          onClick={() => openAddModal()} 
          className="btn-royal btn-add-member"
          title="Thêm thành viên mới"
        >
          <Plus size={15} />
          <span>Thêm Người</span>
        </button>

        {/* Layout Mode Pill */}
        <div className="layout-mode-group">
          <button 
            onClick={handleToggleLayout} 
            className={`btn-mode-toggle ${layoutMode === 'manual' ? 'active-manual' : 'active-auto'}`}
            title={layoutMode === 'auto' ? 'Chuyển sang chế độ Kéo thả tự do' : 'Chuyển sang chế độ Tự động sắp xếp'}
          >
            {layoutMode === 'auto' ? <GitMerge size={14} /> : <Move size={14} />}
            <span>{layoutMode === 'auto' ? 'Tự Động' : 'Kéo Thả'}</span>
          </button>
        </div>

        {/* Edge Style Selector */}
        <div className="edge-style-selector" title="Kiểu đường dây liên kết">
          <select 
            value={settings.edgeStyle || 'step'}
            onChange={(e) => {
              updateSettings({ edgeStyle: e.target.value as any });
              showToast(`Đã đổi dây nối: ${e.target.value === 'step' ? 'Góc vuông' : e.target.value === 'straight' ? 'Đường thẳng' : 'Uốn cong'}`, 'info');
            }}
          >
            <option value="step">Góc Vuông</option>
            <option value="default">Đường Cong</option>
            <option value="straight">Đường Thẳng</option>
          </select>
        </div>

        {/* Utility Menu Dropdown */}
        <div className="menu-dropdown-wrapper" ref={menuRef}>
          <button 
            className={`btn-menu-trigger ${isMenuOpen ? 'active' : ''}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            title="Thao tác & Xuất dữ liệu"
          >
            <MoreHorizontal size={17} />
          </button>

          {isMenuOpen && (
            <div className="menu-dropdown-content">
              <div className="menu-dropdown-header">CÔNG CỤ & DỮ LIỆU</div>
              
              <button className="menu-item" onClick={handleExportPNG} disabled={isExporting}>
                <ImageIcon size={15} className="item-icon gold" />
                <div className="item-text">
                  <span className="item-title">Xuất Ảnh Poster (HD/In ấn)</span>
                  <span className="item-desc">Độ phân giải siêu cao 2.5x</span>
                </div>
              </button>

              <button className="menu-item" onClick={handleCopyText}>
                <ClipboardCopy size={15} className="item-icon" />
                <div className="item-text">
                  <span className="item-title">Sao Chép Cấu Trúc Cây</span>
                  <span className="item-desc">Dạng văn bản có phân cấp</span>
                </div>
              </button>

              <div className="menu-divider" />

              <button className="menu-item" onClick={handleExportJSON}>
                <Download size={15} className="item-icon" />
                <div className="item-text">
                  <span className="item-title">Xuất File JSON</span>
                  <span className="item-desc">Lưu bản sao dự phòng</span>
                </div>
              </button>

              <label className="menu-item file-label">
                <Upload size={15} className="item-icon" />
                <div className="item-text">
                  <span className="item-title">Nhập File JSON</span>
                  <span className="item-desc">Nạp dữ liệu từ máy tính</span>
                </div>
                <input type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportJSON} />
              </label>

              <div className="menu-divider" />

              <button className="menu-item" onClick={openStatsModal}>
                <BarChart3 size={15} className="item-icon" />
                <div className="item-text">
                  <span className="item-title">Bảng Thống Kê Dòng Họ</span>
                  <span className="item-desc">Số đời, phân bố chi nhánh</span>
                </div>
              </button>

              <button className="menu-item" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize2 size={15} className="item-icon" /> : <Maximize2 size={15} className="item-icon" />}
                <div className="item-text">
                  <span className="item-title">{isFullscreen ? 'Thu Nhỏ Màn Hình' : 'Toàn Màn Hình'}</span>
                  <span className="item-desc">Trải nghiệm không gian rộng</span>
                </div>
              </button>

              {layoutMode === 'manual' && (
                <button className="menu-item text-orange" onClick={handleResetLayout}>
                  <RotateCcw size={15} className="item-icon" />
                  <div className="item-text">
                    <span className="item-title">Căn Lại Tự Động Bố Cục</span>
                    <span className="item-desc">Khôi phục toạ độ các nút</span>
                  </div>
                </button>
              )}

              <button className="menu-item text-red" onClick={handleResetDemo}>
                <Trash2 size={15} className="item-icon" />
                <div className="item-text">
                  <span className="item-title">Khôi Phục Bản Mẫu Ban Đầu</span>
                  <span className="item-desc">Xóa các sửa đổi chưa tải</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
