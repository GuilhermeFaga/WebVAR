import { useEffect, useState } from "react"
import GlobalController from "../GlobalController";

export default function ProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const controller = GlobalController.getInstance();
    controller.setOnProgress((progress) => {
      setProgress(progress)
    })
  }, [])

  return (
    <div className="relative z-[100] w-full bg-gray-200 h-1.5 mb-4 dark:bg-gray-700">
      <div className="bg-green-600 h-1 rounded-r-full dark:bg-green-500" style={{ width: `${progress * 100}%` }}></div>
    </div>
  )
}