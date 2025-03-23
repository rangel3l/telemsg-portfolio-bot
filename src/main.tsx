
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Verificar o tema salvo e aplicar antes de renderizar a aplicação
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

createRoot(document.getElementById("root")!).render(<App />);
