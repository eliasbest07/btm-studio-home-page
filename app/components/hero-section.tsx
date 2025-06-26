import Image from "next/image"

export function HeroSection() {
  return (
    <section className="relative w-full h-96">
      <Image
        src="/placeholder.svg?width=1200&height=400"
        layout="fill"
        objectFit="cover"
        alt="Fondo abstracto de la sección principal de BTM Studio" // Atributo alt añadido
        priority
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-white">Bienvenido a BTM Studio</h1>
        <p className="text-xl text-gray-200 mt-2">Creamos experiencias digitales increíbles.</p>
      </div>
    </section>
  )
}
