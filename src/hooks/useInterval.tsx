import { useRef, useEffect } from 'react'

export default function useInterval(cb: any, delay: number) {
  const ref: any = useRef()
  useEffect(() => {
    ref.current = cb
  })
  useEffect(() => {
    const timer = setInterval(() => ref.current(), delay)
    return () => clearInterval(timer)
  }, [delay])
}
