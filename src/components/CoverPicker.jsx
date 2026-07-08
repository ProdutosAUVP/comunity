import { useRef } from 'react'
import { UploadSimple, X } from '@phosphor-icons/react'
import CoverArt, { COVER_ART_IDS } from './CoverArt'

const ART_LABELS = {
  chart: 'Gráfico',
  skyline: 'Skyline',
  ocean: 'Ondas',
  allocation: 'Alocação',
}

// Seletor de capa do post: ilustrações abstratas prontas ou uma imagem
// própria enviada pelo autor. `value` é `null` (sem capa), um dos ids de
// COVER_ART_IDS, ou uma data URL (capa personalizada).
export default function CoverPicker({ value, onChange }) {
  const fileInputRef = useRef(null)
  const isCustom = value && !COVER_ART_IDS.includes(value)

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-wrap gap-[10px]">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={`flex h-[64px] w-[100px] shrink-0 items-center justify-center rounded-[8px] border text-center font-roboto text-[11px] text-muted-foreground transition-all duration-240 ${
          !value ? 'border-primary text-primary' : 'border-border hover:border-primary hover:text-primary'
        }`}
      >
        Sem capa
      </button>

      {COVER_ART_IDS.map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          aria-pressed={value === id}
          className={`h-[64px] w-[100px] shrink-0 overflow-hidden rounded-[8px] border-2 transition-all duration-240 ${
            value === id ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
          }`}
          title={ART_LABELS[id]}
        >
          <CoverArt id={id} className="h-full w-full" />
        </button>
      ))}

      {isCustom ? (
        <div className="relative h-[64px] w-[100px] shrink-0 overflow-hidden rounded-[8px] border-2 border-primary">
          <CoverArt id={value} className="h-full w-full" />
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remover capa personalizada"
            className="absolute right-[3px] top-[3px] rounded-full bg-black/60 p-[3px] text-white transition-all duration-240 hover:bg-black/80"
          >
            <X size={11} weight="bold" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-[64px] w-[100px] shrink-0 flex-col items-center justify-center gap-[4px] rounded-[8px] border border-dashed border-border font-roboto text-[11px] text-muted-foreground transition-all duration-240 hover:border-primary hover:text-primary"
        >
          <UploadSimple size={16} weight="bold" />
          Enviar imagem
        </button>
      )}
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  )
}
