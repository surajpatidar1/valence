import ScrollProgress from './components/ScrollProgress';
import Header from './components/Header';
import Hero from './components/Hero';
import TechStrip from './components/TechStrip';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Process from './components/Process';
import Faq from './components/Faq';
import Contact from './components/Contact';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import { ToastProvider } from './components/Toast';

export default function App() {
  return (
    <ToastProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollProgress />
      <Header />
      <main id="main">
        <Hero ready />
        <TechStrip />
        <Services />
        <Portfolio />
        <Process />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </ToastProvider>
  );
}
