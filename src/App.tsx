import { ReactFlowProvider } from 'reactflow';
import FamilyTree from './components/family/FamilyTree';
import Toolbar from './components/editor/Toolbar';
import { AddPersonModal, EditPersonModal, DetailPanel, StatsModal } from './components/editor/Modals';
import Toast from './components/common/Toast';

function App() {
  return (
    <ReactFlowProvider>
      <Toolbar />
      <FamilyTree />
      <AddPersonModal />
      <EditPersonModal />
      <DetailPanel />
      <StatsModal />
      <Toast />
    </ReactFlowProvider>
  );
}

export default App;
