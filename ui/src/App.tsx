import { Suspense } from 'react';
import { Navbar } from './components/Navbar/Navbar';
import { ChatLayout } from './components/Chat/ChatLayout';

function App(): JSX.Element {
  return (
    <div className="page">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Navbar />
      <Suspense fallback={null}>
        <ChatLayout />
      </Suspense>
    </div>
  );
}

export default App;


