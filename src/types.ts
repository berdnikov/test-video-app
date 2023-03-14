export type MarkList = Mark[]

export type Mark = {
  id: number
  timestamp: number
  duration: number
  isActive?: boolean
  zone: Zone
}

export type Zone = {
  left: number
  top: number
  width: number
  height: number
}
