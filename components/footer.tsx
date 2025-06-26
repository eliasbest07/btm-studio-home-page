import Link from "next/link"
import { GithubIcon, TwitterIcon, LinkedinIcon } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  return (
    <footer className="border-t">
      <div className="container py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-sm text-muted-foreground">&copy; {currentYear} BTM Studio. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="https://github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
            <GithubIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://twitter.com" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
            <TwitterIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
          <Link href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer">
            <LinkedinIcon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
