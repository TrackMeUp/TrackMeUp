import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
import Footer from './components/Footer';

export function Layout() {
  const [showMenu, setShowMenu] = useState(true);

  const toggleMenu = () => setShowMenu(prev => !prev);

  return (
    <div className='layout'>
      <Header onToggleMenu={toggleMenu} />
      <div className='layout-content'>
        <Menu isVisible={showMenu} />
        <div className='content'>
          <Outlet />
        </div>
      </div>
      <Footer />
    </div>
  );
}
