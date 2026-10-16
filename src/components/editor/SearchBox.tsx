import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import { useReactFlow } from 'reactflow';
import type { Person } from '../../models/Person';
import './SearchBox.css';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Person[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { people } = useFamilyStore();
  const { setHighlightedPersonId, openDetailPanel, showToast } = useUIStore();
  const { setCenter, getNodes } = useReactFlow();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Search logic
  useEffect(() => {
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      const matches = people.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        (p.note && p.note.toLowerCase().includes(lowerQuery)) ||
        (p.birthYear && p.birthYear.includes(lowerQuery))
      );
      setResults(matches);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, people]);

  // Handle Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (person: Person) => {
    const nodes = getNodes();
    const targetNode = nodes.find(n => n.id === person.id);
    if (targetNode) {
      setCenter(targetNode.position.x + 66, targetNode.position.y + 25, { zoom: 1.4, duration: 700 });
      setHighlightedPersonId(person.id);
      openDetailPanel(person);
      showToast(`Đã định vị: ${person.name}`, 'info');
    }
    setIsOpen(false);
    setQuery('');
  };

  const getBranchLabel = (type: string) => {
    switch (type) {
      case 'blue': return 'Chi 1';
      case 'green': return 'Chi 2';
      case 'red': return 'Chi 3';
      case 'gold': return 'Chi 4';
      default: return 'Trưởng Chi';
    }
  };

  return (
    <div className="search-box-wrapper" ref={wrapperRef}>
      <div className="search-input-container">
        <Search size={15} className="search-icon" />
        <input 
          ref={inputRef}
          type="text" 
          className="search-input" 
          placeholder="Tìm tên, đời, năm sinh... (Ctrl + K)" 
          value={query}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className="search-clear-btn" onClick={() => { setQuery(''); setIsOpen(false); }}>
            <X size={13} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="search-results-dropdown">
          <div className="search-results-header">
            <span>Kết quả ({results.length})</span>
            <span className="search-hint">Enter để chọn</span>
          </div>

          {results.length > 0 ? (
            <ul className="search-results-list">
              {results.map(person => (
                <li 
                  key={person.id} 
                  className="search-result-item"
                  onClick={() => handleSelect(person)}
                >
                  <div className={`result-color-dot dot-${person.type || 'main'}`} />
                  <div className="result-info">
                    <div className="result-name-row">
                      <span className="result-name">{person.name}</span>
                      <span className="result-gen-tag">Đời {person.generation}</span>
                    </div>
                    <div className="result-sub-row">
                      <span className="result-branch">{getBranchLabel(person.type || 'main')}</span>
                      {(person.birthYear || person.deathYear) && (
                        <span className="result-years">
                          • {person.birthYear || '?'}-{person.deathYear || '?'}
                        </span>
                      )}
                      {person.note && (
                        <span className="result-note">• {person.note}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="search-no-results">
              Không tìm thấy thành viên phù hợp
            </div>
          )}
        </div>
      )}
    </div>
  );
}
