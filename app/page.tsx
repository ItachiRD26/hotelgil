import Header from "@/components/homepage/header";
import Hero from "@/components/homepage/hero";
import Rooms from "@/components/homepage/rooms";
import Policies from "@/components/homepage/policies";
import Contact from "@/components/homepage/contact";
import Services from "@/components/homepage/services";
import Footer from "@/components/homepage/footer";

export default function HomePage() {
  return (
    <div className="bg-white text-gray-900">
      <Header />
      <Hero />
      <Rooms />
      <Services />
      <Policies />
      <Contact />
      <Footer />

    </div>
  );
}
