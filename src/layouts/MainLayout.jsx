import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050d18] via-[#081525] to-[#050d18]">
      <Navbar />

      <main className="pt-[72px]">{children}</main>

      <Footer />
    </div>
  );
};

export default MainLayout;