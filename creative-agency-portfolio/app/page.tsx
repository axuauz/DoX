
import Hero from "./components/Hero"
import DiagnosisForm from "./components/DiagnosisForm"
import EmergencySection from "./components/EmergencySection"
import AboutSection from "./components/AboutSection"
import Footer from "./components/Footer"

export default function Home() {
  return (
    <>
      <Hero />
      <DiagnosisForm />
      <AboutSection />
      <EmergencySection />
    </>
  )
}
