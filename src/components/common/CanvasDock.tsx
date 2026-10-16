import { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Home, 
  Map as MapIcon, 
  HelpCircle,
  X
} from 'lucide-react';
import { useReactFlow } from 'reactflow';
import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import './CanvasDock.css';

interface CanvasDockProps {
  showMiniMap: boolean;
  setShowMiniMap: (show: boolean) => void;
}

export default function CanvasDock({ showMiniMap, setShowMiniMap }: CanvasDockProps) {
  const { zoomIn, zoomOut, zoomTo, fitBounds, setCenter, getNodes } = useReactFlow();
  const { people, relationships } = useFamilyStore();
  const { showToast, setHighlightedPersonId } = useUIStore();
  const [showLegend, setShowLegend] = useState(false);

  const handleFitPoster = () => {
    fitBounds({ x: 0, y: 0, width: 1600, height: 2400 }, { padding: 0.08, duration: 800 });
    showToast('Đã căn chỉnh toàn cảnh phả đồ', 'info');
  };

  const handleCenterRoot = () => {
    // Find root node
    const childIds = new Set(relationships.filter(r => r.type === 'parent-child').map(r => r.targetId));
    const rootPerson = people.find(p => !childIds.has(p.id)) || people[0];

    if (rootPerson) {
      const nodes = getNodes();
      const node = nodes.find(n => n.id === rootPerson.id);
      if (node) {
        setCenter(node.position.x + 66, node.position.y + 25, { zoom: 1.3, duration: 800 });
        setHighlightedPersonId(rootPerson.id);
        showToast(`Đã về Thủy tổ: ${rootPerson.name}`, 'info');
      }
    }
  };

  return (
    <>
      <div className="canvas-dock-container">
        <button 
          className="dock-btn" 
          onClick={() => zoomIn({ duration: 300 })} 
          title="Phóng to (+)"
        >
          <ZoomIn size={16} />
        </button>

        <button 
          className="dock-btn" 
          onClick={() => zoomOut({ duration: 300 })} 
          title="Thu nhỏ (-)"
        >
          <ZoomOut size={16} />
        </button>

        <button 
          className="dock-btn" 
          onClick={() => zoomTo(1, { duration: 300 })} 
          title="Kích thước thực 100%"
        >
          <span className="dock-txt-100">1:1</span>
        </button>

        <div className="dock-divider" />

        <button 
          className="dock-btn" 
          onClick={handleFitPoster} 
          title="Căn vừa toàn cảnh bức tranh"
        >
          <Maximize size={15} />
        </button>

        <button 
          className="dock-btn" 
          onClick={handleCenterRoot} 
          title="Về cụ Thủy tổ đầu tiên"
        >
          <Home size={16} />
        </button>

        <div className="dock-divider" />

        <button 
          className={`dock-btn ${showMiniMap ? 'active' : ''}`}
          onClick={() => setShowMiniMap(!showMiniMap)} 
          title={showMiniMap ? "Ẩn bản đồ thu nhỏ" : "Hiện bản đồ thu nhỏ"}
        >
          <MapIcon size={15} />
        </button>

        <button 
          className={`dock-btn ${showLegend ? 'active' : ''}`}
          onClick={() => setShowLegend(!showLegend)} 
          title="Chú giải màu sắc các chi"
        >
          <HelpCircle size={15} />
        </button>
      </div>

      {/* Floating Legend Card */}
      {showLegend && (
        <div className="legend-card">
          <div className="legend-header">
            <span>CHÚ GIẢI CHI PHÁI</span>
            <button className="legend-close" onClick={() => setShowLegend(false)}>
              <X size={14} />
            </button>
          </div>
          <div className="legend-items">
            <div className="legend-row">
              <span className="legend-dot dot-main" />
              <span className="legend-text"><strong>Bạch Ngọc:</strong> Thủy tổ & Trưởng chi</span>
            </div>
            <div className="legend-row">
              <span className="legend-dot dot-blue" />
              <span className="legend-text"><strong>Lam Ngọc:</strong> Chi 1</span>
            </div>
            <div className="legend-row">
              <span className="legend-dot dot-green" />
              <span className="legend-text"><strong>Thanh Ngọc:</strong> Chi 2</span>
            </div>
            <div className="legend-row">
              <span className="legend-dot dot-red" />
              <span className="legend-text"><strong>Chu Sa:</strong> Chi 3</span>
            </div>
            <div className="legend-row">
              <span className="legend-dot dot-gold" />
              <span className="legend-text"><strong>Hoàng Kim:</strong> Chi 4 & Hậu duệ</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
