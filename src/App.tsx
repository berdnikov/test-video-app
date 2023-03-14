import axios from 'axios'
import { useEffect, useState } from 'react'
import { DATA_URL, VIDEO_URL } from './const'
import { MarkList } from './types'

const App: React.FC = (): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [data, setData] = useState<MarkList>([])
  const [areas, setAreas] = useState<MarkList>([])
  const video = document.getElementById('video') as HTMLVideoElement

  useEffect(() => {
    fetchData()
  })

  if (video) {
    video.ontimeupdate = () => {
      data.map(obj => {
        if (
          video.currentTime >= obj.timestamp / 1000 &&
          video.currentTime <= (obj.timestamp + obj.duration) / 1000
        ) {
          obj.isActive = true
        } else {
          obj.isActive = false
        }

        return setAreas(data.filter(el => el.isActive))
      })
    }
  }

  const fetchData = async () => {
    try {
      const request = await axios.get(DATA_URL)
      setData(sortData(request.data))
      setIsLoading(false)
    } catch (e) {
      console.error(e)
    }
  }

  const formatTime = (time: number) => {
    const sec = Math.floor((time / 1000) % 60)
    const min = Math.floor((time / 1000 / 60) % 60)
    const ms = time - min * 60000 - sec * 1000

    const formattedTime = [
      min.toString().padStart(2, '0'),
      sec.toString().padStart(2, '0'),
      ms.toString().padStart(3, '0')
    ].join(':')
    return formattedTime
  }

  const sortData = (data: MarkList) => {
    return data.sort((a, b) => a.timestamp - b.timestamp)
  }

  // function toggleVideo() {
  //   video && video.paused ? video.play() : video.pause()
  //   console.log(Math.floor(video.currentTime * 1000))
  // }

  function setVideoTime(time: number) {
    video.currentTime = time / 1000
  }

  return (
    <div className="container">
      <div className="wrapper">
        <div className="player">
          {isLoading ? (
            <div>LOADING ... </div>
          ) : (
            <div id="container" className="player__container">
              <video
                id="video"
                preload="metadata"
                className="player__video"
                controls
              >
                <source src={VIDEO_URL} />
              </video>

              {areas.map(el => (
                <div
                  id={`area_${el.id}`}
                  className="player__area"
                  style={{
                    top: `${el.zone.top}px`,
                    left: `${el.zone.left}px`,
                    width: `${el.zone.width}px`,
                    height: `${el.zone.height}px`
                  }}
                  key={el.id}
                />
              ))}
            </div>
          )}
        </div>

        {!isLoading && (
          <ul>
            {data.map(item => (
              <li key={item.id} onClick={() => setVideoTime(item.timestamp)}>
                <code>{formatTime(item.timestamp)}</code>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default App
