/**
 * 加载 js 文件
 * @param {string} url 需要加载的 js 地址
 */
export const loadJs = (url: string): Promise<boolean> => {
  return new Promise(resolve => {
    const ndScripts = document.querySelectorAll<HTMLScriptElement>('head script')
    for (const x of ndScripts) {
      if (x.src === url || x.attributes.getNamedItem('src')?.value === url) {
        // 如果已存在相同的 js 则返回成功
        return resolve(true)
      }
    }

    const ndHead = document.querySelector('head')
    const ndScript = document.createElement('script')
    ndScript.onload = () => {
      resolve(true)
    }
    ndScript.onerror = () => {
      resolve(false)
      ndScript.remove()
    }
    ndScript.src = url
    ndHead && ndHead.appendChild(ndScript)
  })
}

/**
 * 摄像头权限访问
 */
export const requestCameraAccess =  async (errorHandler: Function) : Promise<boolean> => {
  let cameraAccess = false
  const devices = await navigator.mediaDevices.enumerateDevices()
  const videoDevices = devices.filter((device: MediaDeviceInfo) => device.kind === "videoinput")
  if(videoDevices.length){
    cameraAccess = videoDevices.every((device: MediaDeviceInfo) => device.label !== "")
  }

  if(!cameraAccess){
    await navigator.mediaDevices
    .getUserMedia({
      audio: false,
      video: true
    })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop())
      cameraAccess = true
    })
    .catch((err) => {
      if (
        err.message === "Permission denied" ||
        err.message.includes("denied permission")
      ) {
        cameraAccess = false
      }
      errorHandler()
      console.error(err.message)
    })
  }

  return cameraAccess
}