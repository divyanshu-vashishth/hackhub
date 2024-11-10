import { Hero } from "~/components/Hero";
import { Features } from "~/components/Features";
import { Interaction } from "~/components/Interaction";
import { Testimonials } from "~/components/Testimonials";
import { Footer } from "~/components/Footer";
import { api, HydrateClient } from "~/trpc/server";
import { Navbar } from "~/components/Navbar";

export default async function Home() {
  return (
    <HydrateClient>
      <Navbar />
      <main className="mx-auto max-w-6xl">
        <Hero />
        <Features />
        <Interaction />
        <Testimonials />
      </main>
      <Footer />
    </HydrateClient>
  );
}
