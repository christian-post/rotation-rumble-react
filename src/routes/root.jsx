import { Outlet } from 'react-router-dom';

import Header from '../partials/header';
import Footer from '../partials/footer';

export default function Root() {
    return (
      <>
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  }