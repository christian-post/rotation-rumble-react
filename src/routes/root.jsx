import { Outlet, useNavigation } from "react-router-dom";

import Header from "../partials/Header";
import Footer from "../partials/Footer";
import CustomAlert from "../components/CustomAlert";
import LoadingPlaceholder from "./loading-placeholder";

export default function Root() {
  const navigation = useNavigation();

  return (
    <>
      <CustomAlert />
      <Header />
      {navigation.state === "loading" ? <LoadingPlaceholder /> : <Outlet />}
      <Footer />
    </>
  );
}
