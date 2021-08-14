
export function turnBracketsToAlt(stringProp) {
  try {
    const imgIndex = stringProp.indexOf('<img ')
    let mutableString = stringProp
    if (imgIndex > -1) {
      const matched = stringProp.match(/<img .*?>/g)
      matched?.forEach((matchedString) => {
        const matchedIndex = stringProp.indexOf(matchedString)
        const matchedLength = matchedString.length
        const afterStringIndex = matchedIndex + matchedLength
        const afterString = stringProp[afterStringIndex]
        const srcUrl = matchedString.match(/src=".+?"/)

        const gifUrl = srcUrl[0].match(process.env.NEXT_PUBLIC_GIF_CLOUDFRONT)
        if (gifUrl) {
          return mutableString
        }

        if (afterString === '[') {
          const addressArray = srcUrl ? srcUrl[0]?.split('/') : null
          console.log(addressArray)
          const convertedAtob = addressArray ? JSON.parse(Buffer.from(addressArray[3], 'base64').toString()) : null
          const altBeginning = stringProp.indexOf('[', afterStringIndex)
          const altEnd = stringProp.indexOf(';', afterStringIndex)
          const bracketEnd = stringProp.indexOf(']', altBeginning)
          const altLength = altEnd - altBeginning
          const brackets = stringProp.slice(altBeginning + 1, bracketEnd)
          const heightObj = brackets.match(/h:([0-9]+)/) 
          const widthObj = brackets.match(/w:([0-9]+)/)
          const imgHeight = heightObj ? heightObj[1] : 675
          const imgWidth = widthObj ? widthObj[1] : 900
          const newJson = {
            bucket: convertedAtob.bucket,
            key: convertedAtob.key,
            edits: {
              resize: {
                width: imgWidth,
                height: imgHeight
              }
            }
          }
          const convertedBTOA = Buffer.from(JSON.stringify(newJson)).toString('base64')
          // const convertedUrl = process.env.NEXT_PUBLIC_IMG_CLOUDFRONT + "/" + convertedBTOA
          const convertedUrl = "https://" + addressArray[2] +"/" + convertedBTOA
          if (altLength < 161) {
            const altString = stringProp.slice(altBeginning + 1, altEnd)
            const allBrackets = stringProp.slice(altBeginning + 1, bracketEnd)
            const string = matchedString.slice(0, 4) 
            + " alt='" + altString + "'" 
            + " width='" + imgWidth + "'"
            + " height='" + imgHeight + "'"
            + matchedString.slice(4, -1)
            mutableString = mutableString.replace(matchedString + '[' + allBrackets + ']', string + '>')
          }
          mutableString = mutableString.replace(srcUrl, `src="${convertedUrl}"` )
        }
      })
      return mutableString
    }
    return stringProp
  } catch (err) {
    console.log(err)
  }
}

export function pullBracketData(stringProp) {
  /* this is for within blogEdit */
try {
  const imgIndex = stringProp.indexOf('<img ')
  let mutableString = stringProp
  if (imgIndex > -1) {
    const matched = stringProp.match(/<img .*?>/g)
    matched.forEach((matchedString) => {
      const matchedIndex = stringProp.indexOf(matchedString)
      const matchedLength = matchedString.length
      const afterStringIndex = matchedIndex + matchedLength
      const afterString = stringProp[afterStringIndex]
      const srcUrl = matchedString.match(/src=".+?"/)
      const gifUrl = srcUrl[0].match(process.env.NEXT_PUBLIC_GIF_CLOUDFRONT)
      if (gifUrl) {
        return mutableString
      }
      if (afterString === '[') {
        const addressArray = srcUrl ? srcUrl[0].split('/') : null
        const convertedAtob = addressArray ? JSON.parse(Buffer.from(addressArray[3], 'base64').toString()) : null
        const altBeginning = stringProp.indexOf('[', afterStringIndex)
        const altEnd = stringProp.indexOf(';', afterStringIndex)
        const bracketEnd = stringProp.indexOf(']', altBeginning)
        const altLength = altEnd - altBeginning
        const brackets = stringProp.slice(altBeginning + 1, bracketEnd)
        const heightObj = brackets.match(/h:([0-9]+)/)
        const widthObj = brackets.match(/w:([0-9]+)/)
        const imgHeight = heightObj ? heightObj[1] : 675
        const imgWidth = widthObj ? widthObj[1] : 900
        const newJson = {
          bucket: convertedAtob.bucket,
          key: convertedAtob.key,
          edits: {
            resize: {
              width: imgWidth,
              height: imgHeight
            }
          }
        }
        const convertedBTOA = Buffer.from(JSON.stringify(newJson)).toString('base64')
        // const convertedUrl = process.env.NEXT_PUBLIC_IMG_CLOUDFRONT + "/" + convertedBTOA
        const convertedUrl = "https://" + addressArray[2] +"/" + convertedBTOA
        if (altLength < 161) {
          const altString = stringProp.slice(altBeginning + 1, altEnd)
          const allBrackets = stringProp.slice(altBeginning + 1, bracketEnd)
          const string = matchedString.slice(0, 4) + " alt='" + altString + "'" + matchedString.slice(4, -1) + '>'
          mutableString = mutableString.replace(matchedString, string)
        }
        mutableString = mutableString.replace(srcUrl, `src="${convertedUrl}"`)
      }
    })

    return mutableString
  }
  return stringProp
} catch (err) {
  console.log(err)
}

}