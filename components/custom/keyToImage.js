import { Storage, Auth } from 'aws-amplify'
import '../../configureAmplify'

export default async function KeyToImage(stringProp) {
  const keyStart = stringProp.indexOf('{key: ')
  /* if key doesn't exist, key start = -1 and will slice funky, 
  if key doesn't get replaced, shit will run forever and crash*/
  console.log(keyStart)
  if (keyStart > -1) {
    const keyEnd = stringProp.indexOf(',', keyStart)
    const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)

    const idStart = stringProp.indexOf(' id: ', keyStart)
    const idEnd = stringProp.indexOf('}', keyStart)
    const identityId = stringProp.slice(idStart + 5, idEnd)

    const getS3 = await Storage.get(slicedKey, {
      level: 'protected',
      identityId: identityId
    })
    const stringWithImg = stringProp.replace(`{key: ${slicedKey}, id: ${identityId}}`, `<img src="${getS3}" />`)
    const allKeysToImages = await KeyToImage(stringWithImg)
    return allKeysToImages
  } else {
    return stringProp
  }
}