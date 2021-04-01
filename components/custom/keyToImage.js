import { Storage } from 'aws-amplify'
import '../../configureAmplify'

export default async function KeyToImage(stringProp) {
  const keyStart = stringProp.indexOf('{key: ')
  // const keys = []
  /* if key doesn't exist, key start = -1 and will slice funky*/
  if (keyStart > -1) {
    const keyEnd = stringProp.indexOf('}', keyStart)
    const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)
    Storage.configure({ level: 'protected' })
    const getS3 = await Storage.get(slicedKey)
    const stringWithImg = stringProp.replace(`{key: ${slicedKey}}`, `<img src="${getS3}" />`)
    // keys.push({[slicedKey]: getS3})
    const allKeysToImages = await KeyToImage(stringWithImg)
    // console.log(keys)
    return allKeysToImages
    // return {
    //   stringWithImages: allKeysToImages,
    //   imgKeys: keys
    // }
  } else {
    return stringProp
  }
}