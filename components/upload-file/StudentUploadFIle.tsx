import React, { useState, useCallback, useMemo } from "react"
import { Input } from "../ui/input"
import Image from "next/image"

interface StudentUploadFileProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  onChange: (value: File | null) => void
  value?: File | null
}

const StudentUploadFile = React.forwardRef<HTMLInputElement, StudentUploadFileProps>(
  ({ value, onChange, className, ...props }, ref) => {
    const [isDragging, setIsDragging] = useState(false)

    const handleDrag = useCallback((e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true)
      } else if (e.type === "dragleave") {
        setIsDragging(false)
      }
    }, [])

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) onChange(file)
      },
      [onChange]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) onChange(file)
    }

    const preview = useMemo(() => {
      if (!value) return null

      if (value.type.startsWith("image/")) {
        return <img
          src={URL.createObjectURL(value)}
          alt="Preview"
          height={128}
          width={128}
          className="h-32 w-32 object-cover rounded-lg"
        />
      }

      const iconProps = { className: "h-12 w-12 text-primary" }

      if (value.type === "application/pdf") {
        return (
          <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.4145.414A1 1 0 0119 5.414V19a2 2 0 01-2 2z" />
          </svg>
        )
      }

      if (value.type.includes("word") || value.type.includes("document")) {
        return (
          <svg {...iconProps} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
<path d="M 28.875 0 C 28.855469 0.0078125 28.832031 0.0195313 28.8125 0.03125 L 0.8125 5.34375 C 0.335938 5.433594 -0.0078125 5.855469 0 6.34375 L 0 43.65625 C -0.0078125 44.144531 0.335938 44.566406 0.8125 44.65625 L 28.8125 49.96875 C 29.101563 50.023438 29.402344 49.949219 29.632813 49.761719 C 29.859375 49.574219 29.996094 49.296875 30 49 L 30 44 L 47 44 C 48.09375 44 49 43.09375 49 42 L 49 8 C 49 6.90625 48.09375 6 47 6 L 30 6 L 30 1 C 30.003906 0.710938 29.878906 0.4375 29.664063 0.246094 C 29.449219 0.0546875 29.160156 -0.0351563 28.875 0 Z M 28 2.1875 L 28 6.6875 C 27.941406 6.882813 27.941406 7.085938 28 7.28125 L 28 42.8125 C 27.972656 42.945313 27.972656 43.085938 28 43.21875 L 28 47.8125 L 2 42.84375 L 2 7.15625 Z M 30 8 L 47 8 L 47 42 L 30 42 L 30 37 L 44 37 L 44 35 L 30 35 L 30 29 L 44 29 L 44 27 L 30 27 L 30 22 L 44 22 L 44 20 L 30 20 L 30 15 L 44 15 L 44 13 L 30 13 Z M 4.625 15.65625 L 8.4375 34.34375 L 12.1875 34.34375 L 14.65625 22.375 C 14.769531 21.824219 14.875 21.101563 14.9375 20.25 L 14.96875 20.25 C 14.996094 21.023438 15.058594 21.75 15.1875 22.375 L 17.59375 34.34375 L 21.21875 34.34375 L 25.0625 15.65625 L 21.75 15.65625 L 19.75 28.125 C 19.632813 28.828125 19.558594 29.53125 19.53125 30.21875 L 19.5 30.21875 C 19.433594 29.339844 19.367188 28.679688 19.28125 28.21875 L 16.90625 15.65625 L 13.40625 15.65625 L 10.78125 28.0625 C 10.613281 28.855469 10.496094 29.582031 10.46875 30.25 L 10.40625 30.25 C 10.367188 29.355469 10.308594 28.625 10.21875 28.09375 L 8.1875 15.65625 Z"></path>
</svg>
        )
      }

      return (
        <svg {...iconProps} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    }, [value])

    const fileSize = useMemo(() => {
      if (!value?.size) return ""
      const sizeInKB = value.size / 1024
      return sizeInKB > 1024
        ? `${(sizeInKB / 1024).toFixed(1)} MB`
        : `${Math.round(sizeInKB)} KB`
    }, [value])

    return (
      <div className={`space-y-4 ${className}`}>
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center
            ${isDragging ? "border-primary bg-primary/10" : "border-muted-foreground/30"}
            ${!value ? "cursor-pointer" : ""}
            transition-colors
          `}
        >
          {value ? (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {preview}
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center">
                <p className="font-medium">{value.name}</p>
                <p className="text-sm text-muted-foreground">{fileSize}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4 text-muted-foreground">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-center">
                <span className="font-medium text-primary">Cliquez pour upload</span> ou glissez-déposez
              </p>
              <p className="text-sm text-muted-foreground">Formats supportés: JPG, PNG, PDF, DOCX</p>
            </>
          )}

          <Input
            {...props}
            ref={ref}
            type="file"
            onChange={handleChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className={`absolute inset-0 cursor-pointer ${value ? "hidden" : ""}`}
          />
        </div>
      </div>
    )
  }
)

StudentUploadFile.displayName = "StudentUploadFile"

export { StudentUploadFile }