
export default function RoundButton({ children, onClick, className, disabled = false }) {
  return (
    <button disabled={disabled} type="button" className={"p-2.5 group bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none dark:bg-gray-600 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-gray-100 disabled:dark:hover:bg-gray-600 ".concat(className)}
      onClick={onClick}>
      {children}
    </button>
  )
}