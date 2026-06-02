import { CVProvider } from './context/CVContext';
import AppLayout from './components/AppLayout';

function App() {
  return (
    <CVProvider>
      <AppLayout />
    </CVProvider>
  );
}

export default App;
