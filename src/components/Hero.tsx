import Image from "next/image"
import Link from "next/link"

export function Hero() {
  return (
    <div className="hero min-h-screen">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <Image
          src="assets/Mobile-development-amico.svg" 
          alt="Hero"
          width={500}
          height={500}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-5xl font-bold orange-text-gradient">Learn, Build & Share</h1>
              <p className="py-6  text-xl font-semibold">
            Join our community of developers to learn, build and share your projects.
          </p>
          <Link href="/projects">
            <button className="btn btn-primary">Get Started</button>
          </Link>
        </div>
      </div>
    </div>
  )
}
