import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HeroSection() {
  return (
    <section className="container py-12 md:py-20 lg:py-28">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Creative Solutions for Your Modern Business
          </h1>
          <p className="text-lg text-muted-foreground md:text-xl">
            BTM Studio crafts stunning websites and powerful applications that drive growth and engage your audience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button asChild size="lg">
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/portfolio">View Our Work</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-video w-full max-w-2xl mx-auto">
          <Image
            src="/placeholder.svg?width=1280&height=720"
            alt="Modern digital agency workspace with computers and creative team"
            layout="fill"
            objectFit="cover"
            className="rounded-lg shadow-xl"
            priority // Good for LCP
          />
        </div>
      </div>
    </section>
  )
}
