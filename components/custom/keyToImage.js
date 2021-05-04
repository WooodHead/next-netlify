export function turnBracketsToAlt(stringProp) {
  const imgIndex = stringProp.indexOf('<img ')
  let mutableString = stringProp
  console.log(stringProp)
  if (imgIndex > -1) {
    const matched = stringProp.match(/<img .*?>/g)
    matched.forEach((matchedString) => {
      console.log('matchedstring', matchedString)
      const matchedIndex = stringProp.indexOf(matchedString)
      const matchedLength = matchedString.length
      const afterStringIndex = matchedIndex + matchedLength
      const afterString = stringProp[afterStringIndex]
      const srcUrl = matchedString.match(/src=".+?"/)
      const addressArray = srcUrl[0].split('/')
      const convertedAtob = JSON.parse(Buffer.from(addressArray[3], 'base64').toString())
      if (afterString === '[') {
        const altBeginning = stringProp.indexOf('[', afterStringIndex)
        const altEnd = stringProp.indexOf(';', afterStringIndex)
        const bracketEnd = stringProp.indexOf(']', altBeginning)
        const altLength = altEnd - altBeginning
        const brackets = stringProp.slice(altBeginning + 1, bracketEnd)
        const heightObj = brackets.match(/(h:[0-9]+)/)
        const widthObj = brackets.match(/(w:[0-9]+)/)
        const imgHeight = heightObj[0].match(/[0-9]+/)
        const imgWidth = widthObj[0].match(/[0-9]+/)
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
        const convertedUrl = process.env.img_cloudfront + "/" + convertedBTOA
        console.log(altLength)
        if (altLength < 161) {
          const altString = stringProp.slice(altBeginning + 1, altEnd)
          const allBrackets = stringProp.slice(altBeginning + 1, bracketEnd)
          const string = matchedString.slice(0, 4) + " alt='" + altString + "'" + matchedString.slice(4, -1)
          mutableString = mutableString.replace(matchedString + '[' + allBrackets + ']', string + '>')
          console.log('hello', string)
        }
        mutableString = mutableString.replace(srcUrl, `src="${convertedUrl}"` )
      }
    })
    return mutableString
  }
  return stringProp
}

export function pullBracketData(stringProp) {
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
      const addressArray = srcUrl[0].split('/')
      const convertedAtob = JSON.parse(Buffer.from(addressArray[3], 'base64').toString())
      if (afterString === '[') {
        const altBeginning = stringProp.indexOf('[', afterStringIndex)
        const altEnd = stringProp.indexOf(';', afterStringIndex)
        const bracketEnd = stringProp.indexOf(']', altBeginning)
        const altLength = altEnd - altBeginning
        const brackets = stringProp.slice(altBeginning + 1, bracketEnd)
        const heightObj = brackets.match(/(h:[0-9]+)/)
        const widthObj = brackets.match(/(w:[0-9]+)/)
        const imgHeight = heightObj[0].match(/[0-9]+/)
        const imgWidth = widthObj[0].match(/[0-9]+/)
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
        const convertedUrl = process.env.img_cloudfront + "/" + convertedBTOA
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
}