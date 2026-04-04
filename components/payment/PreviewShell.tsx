type Props = {
  content: Record<string, string>
  fields: { key: string; label: string }[]
  category: string
}

export default function PreviewShell({ content, fields, category }: Props) {
  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-lg p-8 shadow-sm">
      <div className="border-b pb-4 mb-6">
        <p className="text-sm text-gray-400 uppercase tracking-wide">{category}</p>
        <h2 className="text-xl font-bold mt-1">Document Preview</h2>
      </div>

      <div className="space-y-4">
        {fields.map(field => {
          const value = content[field.key]
          if (!value) return null
          const isRedacted = value.includes('████')

          return (
            <div key={field.key}>
              <p className="text-xs text-gray-400 uppercase mb-1">{field.label}</p>
              <p className={`text-sm ${isRedacted ? 'text-gray-300 select-none' : 'text-gray-800'}`}>
                {value}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
