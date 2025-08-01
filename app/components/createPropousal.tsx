"use client"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface SendProposalModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (proposalText: string) => void
}

export default function SendProposalModal({
  isOpen,
  onOpenChange,
  onSubmit,
}: SendProposalModalProps) {
  const [proposalText, setProposalText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 150)
    } else {
      setProposalText("")
    }
  }, [isOpen])

  const handleSubmit = async () => {
    if (!proposalText.trim()) return
    setSubmitting(true)
    await onSubmit(proposalText.trim())
    setSubmitting(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-zinc-900 text-gray-100 border border-zinc-700"
        style={{ backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">
            Enviar propuesta de proyecto
          </DialogTitle>
        </DialogHeader>

        <Textarea
          ref={textareaRef}
          placeholder="Escribe tu propuesta aquí..."
          value={proposalText}
          onChange={(e) => setProposalText(e.target.value)}
          className="resize-none bg-white/5 text-gray-100 placeholder:text-gray-400 focus:ring-yellow-400"
          rows={5}
        />

        <DialogFooter className="mt-4">
          <Button
            onClick={handleSubmit}
            disabled={submitting || !proposalText.trim()}
            className="bg-yellow-400 text-black hover:bg-yellow-300"
          >
            {submitting ? "Enviando..." : "Aceptar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
