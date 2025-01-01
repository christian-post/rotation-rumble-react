import { Outlet } from 'react-router-dom';

import Header from '../partials/Header';
import Footer from '../partials/Footer';
import CustomAlert from '../components/CustomAlert';

export default function Root() {
    return (
      <>
        <CustomAlert />
        <Header />
        <Outlet />
        <Footer />
      </>
    );
  }