
export function Input({placeholder, ref, type = "text"}: {placeholder: string; ref: any; type?: string}) {
  return <div>
    <input ref={ref} placeholder={placeholder} type={type} className="px-4 py-2 border rounded m-2"></input>
  </div>
}