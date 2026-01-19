import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './pages/Hero';
import { Introduction } from './pages/Introduction';
import { LeaderMessage } from './pages/LeaderMessage';
import { Progress } from './pages/Progress';
import { ServiceDetails } from './pages/ServiceDetails';
import { SoftwareListing } from './pages/SoftwareListing';
import { SoftwareDetails } from './pages/SoftwareDetails';
import { Acknowledgements } from './pages/Acknowledgements';
import { Conclusion } from './pages/Conclusion';
import { Contact } from './pages/Contact';
import { AdminPanel } from './pages/admin/AdminPanel';

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="*" element={
            <div className="min-h-screen w-full">
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Hero />} />
                  <Route path="/about" element={<Introduction />} />
                  <Route path="/services" element={<Progress />} />
                  <Route path="/services/:serviceId" element={<ServiceDetails />} />
                  <Route path="/software" element={<SoftwareListing />} />
                  <Route path="/software/:softwareId" element={<SoftwareDetails />} />
                  <Route path="/leadership" element={<LeaderMessage />} />
                  <Route path="/team" element={<Acknowledgements />} />
                  <Route path="/impact" element={<Conclusion />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
