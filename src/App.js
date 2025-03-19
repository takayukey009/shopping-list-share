import { BrowserRouter, Routes, Route } from 'react-router-dom';
import List from './pages/List';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<List />} />
        <Route path="/:listId" element={<List />} />
      </Routes>
    </BrowserRouter>
  );
}
