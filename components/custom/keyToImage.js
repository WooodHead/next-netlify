import { Storage } from 'aws-amplify'
import '../../configureAmplify'

export default async function KeyToImage(stringProp) {
  const keyStart = stringProp.indexOf('{key: ')
  /* if key doesn't exist, key start = -1 */
  if (keyStart > -1) {
    const keyEnd = stringProp.indexOf('}', keyStart)
    const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)
    Storage.configure({ level: 'protected' })
    const getS3 = await Storage.get(slicedKey)
    const stringWithImg = stringProp.replace(`{key: ${slicedKey}}`, `<img src="${getS3}" />`)
    return stringWithImg
  } else {
    return stringProp
  }
}