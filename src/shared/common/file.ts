import { FileType } from 'src/config/enum.config'

export function minitypeToFileType(minitype: string): FileType {
  const imageRegexp = /image\/.*/
  const videoRegexp = /video\/.*/
  const audioRegexp = /audio\/.*/

  const checkFileType = (minitype: string, regexp: RegExp) =>
    regexp.test(minitype)

  switch (true) {
    case checkFileType(minitype, imageRegexp):
      return FileType.Image
    case checkFileType(minitype, videoRegexp):
      return FileType.Video
    case checkFileType(minitype, audioRegexp):
      return FileType.Audio
    default:
      return FileType.Other
  }
}
