import Storage from '@aws-amplify/storage'
import '../../configureAmplify'

// export default async function KeyToImage(stringProp) {
//   /* if key doesn't exist, key start = -1 and will slice funky, 
//   if key doesn't get replaced, shit will run forever and crash*/

//   const keyStart = stringProp.indexOf('{key: ')
//   if (keyStart > -1) {
//     const keyEnd = stringProp.indexOf(',', keyStart)


//     const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)

//     const idStart = stringProp.indexOf(' id: ', keyStart)
//     const idEnd = stringProp.indexOf('}', keyStart)
//     const identityId = stringProp.slice(idStart + 5, idEnd)
//     /* this relies on the data being stored in dynamo to prevent unlimited calls */
//     const getS3 = await Storage.get(slicedKey, {
//       level: 'protected',
//       identityId: identityId
//     })
//     const stringWithImg = stringProp.replace(`{key: ${slicedKey}, id: ${identityId}}`, `<img src="${getS3}" />`)
//     const allKeysToImages = await KeyToImage(stringWithImg)
//     return allKeysToImages
//   } else {
//     return stringProp
//   }
// }

export default function KeyToImage (stringProp) {
  const keyStart = stringProp.indexOf('{key: ')
  if (keyStart > -1) {
    const keyEnd = stringProp.indexOf(',', keyStart)
    const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)
    const jsonToUrl = {
      "bucket": "talktreeimagespublic",
      "key": `public/${slicedKey}`,
      "edits": {
        "resize": {
          "width": 900,
          "height": 675,
          "fit": "cover"
        }
      }
    }
    const converting = Buffer.from(JSON.stringify(jsonToUrl)).toString('base64')
    console.log(slicedKey)
    const convertedUrl = "https://d1pvyp5tr4e89i.cloudfront.net/" + converting
    const idStart = stringProp.indexOf(' id: ', keyStart)
    const idEnd = stringProp.indexOf('}', keyStart)
    const identityId = stringProp.slice(idStart + 5, idEnd)
    const stringWithImg = stringProp.replace(`{key: ${slicedKey}, id: ${identityId}}`, `<img src="${convertedUrl}" />`)
    const allKeysToImages = KeyToImage(stringWithImg)
    return allKeysToImages
  } else {
    return stringProp
  }
}