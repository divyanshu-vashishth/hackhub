import Image from "next/image"

export function Testimonials() {
  return (
    <div className="py-24">
      <h2 className="text-4xl font-bold text-center mb-12 blue-text-gradient">What Developers Say</h2>
      <div className="flex flex-wrap justify-center gap-8 max-w-6xl mx-auto px-4">
        <div className="card w-96 bg-base-100 border shadow-2xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <Image 
                    src={'https://i.pravatar.cc/64'}
                    alt="Avatar"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold">Sarah Chen</h3>
                <p className="text-sm opacity-70">Frontend Developer</p>
              </div>
            </div>
            <p>"HackHub has been amazing for getting feedback on my projects and connecting with other developers."</p>
          </div>
        </div>

        <div className="card w-96 border bg-base-100 shadow-2xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <Image 
                    src={'https://i.pravatar.cc/65'}
                    alt="Avatar"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold">Alex Thompson</h3>
                <p className="text-sm opacity-70">Full Stack Developer</p>
              </div>
            </div>
            <p>"The community here is incredibly supportive. I've learned so much from code reviews and discussions."</p>
          </div>
        </div>

        <div className="card w-96 border bg-base-100 shadow-2xl hover:shadow-2xl transition-all">
          <div className="card-body">
            <div className="flex items-center gap-4 mb-4">
              <div className="avatar">
                <div className="w-16 rounded-full">
                  <Image 
                    src={'https://i.pravatar.cc/66'}
                    alt="Avatar"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold">Maria Garcia</h3>
                <p className="text-sm opacity-70">Backend Developer</p>
              </div>
            </div>
            <p>"HackHub has helped me grow my network and find amazing collaboration opportunities."</p>
          </div>
        </div>
      </div>
    </div>
  )
}
