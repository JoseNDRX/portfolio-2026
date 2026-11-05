import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Courses from '@/components/Courses';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import UniverseBoard from '@/components/universe/UniverseBoard';
import UniverseIntro from '@/components/universe/UniverseIntro';
import UniverseMotion from '@/components/universe/UniverseMotion';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Courses />
        <Contact />
      </main>
      <Footer />
      <UniverseBoard />
      <UniverseIntro />
      <UniverseMotion />
    </>
  );
}
