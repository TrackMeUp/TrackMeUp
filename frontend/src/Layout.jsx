import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Menu } from './components/Menu';
//import { Footer } from './components/Footer';


export function Layout() {
  return (
    <div className='layout'>
      <Header />
      <Menu />
      {/* <Footer /> */}

      <div className='content'>
        <Outlet />
      </div>

    </div>
  );
};
