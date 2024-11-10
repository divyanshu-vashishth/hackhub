
import Image from "next/image"

export function Interaction() {
  return (
    <div className=' flex items-center justify-center py-20'>
      <div className='grid grid-cols-1 md:grid-cols-12 gap-8 max-w-6xl mx-auto px-4'>
        <div className='md:col-span-6 flex items-center justify-center'>
          <Image 
            src="assets/Open-source-bro.svg" 
            alt="interaction"
            width={600}
            height={600}
            className="max-w-full h-auto"
          />
        </div>
        <div className='md:col-span-6 flex flex-col justify-center space-y-6'>
          <h2 className='text-5xl font-bold text-right green-text-gradient'>
            Interact With Other Creators
          </h2>
          <div className='text-xl text-right space-y-2'>
            <p className="font-semibold ">Join us to connect, Collaborate with like minded Individuals who share your interest</p>
          </div>
        </div>
      </div>
    </div>
  )
}