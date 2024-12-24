import { Outlet } from 'react-router-dom';

import Header from '../partials/Header';
import Footer from '../partials/Footer';

export default function Root() {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  }