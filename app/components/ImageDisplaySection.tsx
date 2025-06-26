import Image from "next/image"

interface ImageDisplaySectionProps {
  imageUrl: string
  altText: string
  title?: string
}

export default function ImageDisplaySection({
  imageUrl,
  altText,
  title = "Imagen Destacada",
}: ImageDisplaySectionProps) {
  if (!imageUrl) {
    return (
      <section className="container mx-auto py-12 md:py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">{title}</h2>
        <p className="text-red-500">No se proporcionó URL para la imagen.</p>
      </section>
    )
  }

  return (
    <section className="container mx-auto py-12 md:py-20">
      <h2 className="text-3xl font-bold mb-8 text-center">{title}</h2>
      <div className="relative w-full max-w-4xl mx-auto aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
        {/* El div anterior actúa como contenedor para 'layout="fill"' */}
        <Image
          src={imageUrl || "/placeholder.svg"}
          alt={altText}
          layout="fill" // 'fill' hace que la imagen llene el contenedor padre.
          objectFit="cover" // 'cover' asegura que la imagen cubra el área sin distorsionarse, recortando si es necesario.
          // Si conoces las dimensiones, puedes usarlas y 'layout="responsive"'
          // width={1280}
          // height={720}
          // layout="responsive"
          className="transition-transform duration-500 hover:scale-105"
        />
      </div>
      <p className="text-center text-sm text-muted-foreground mt-4">{altText}</p>
    </section>
  )
}
