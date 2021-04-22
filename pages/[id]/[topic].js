import React, { useEffect, useState } from 'react'
import API from '@aws-amplify/api'
import { useRouter } from 'next/router'
import Head from 'next/head'
import '../../configureAmplify'
import NavbarComp from '../../components/navbar/navbar'
import UserComp from '../../components/[id]/userComp'
// import KeyToImage from '../../components/custom/keyToImage'
// import Image from 'next/image'

function KeyToImage (stringProp) {
  const keyStart = stringProp.indexOf('{key: ')
  if (keyStart > -1) {
    const keyEnd = stringProp.indexOf(',', keyStart)
    const vw = 600
    const slicedKey = '' + stringProp.slice(keyStart + 6, keyEnd)
    const jsonToUrl = {
      "bucket": "talktreeimagespublic",
      "key": `${slicedKey}`,
      "edits": {
        "resize": {
          "width": 900,
          "height": 675,
          "fit": "cover"
        }
      }
    }
    const converting = Buffer.from(JSON.stringify(jsonToUrl)).toString('base64')
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

export default function Topic({ user, topic }) {
  const router = useRouter()
  if (router.isFallback) {
    return (
      <div>
        the page is being created, try refreshing the page
      </div>
    )
  }

  const userOnboarded = user.receiver
  // const firstImgAddress = topic.firstImage
  const description = topic.description
  const title = topic.title



  // const newString = KeyToImage(topic.string)

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {/* <meta property="og:image" content={firstImgAddress}></meta> */}
      </Head>
      <div className="">
        <NavbarComp />
        <UserComp user={user} />
        {/* <img src={html}  /> */}
        <div className="mx-5">
            <div 
              className="flex justify-center my-5 bg-gray-100" 
              >
                <div 
                className="m-3 prose-sm prose sm:prose overflow-auto"
                dangerouslySetInnerHTML={{ __html: topic.stringNoKeys }} >

                </div>
                
              </div>
              <p>after injection</p>
        </div>
      </div>
    </>
  )
}

export async function getStaticPaths() {
  const allUsersInit = { headers: { Authorization: "all" } }
  const getAllUsersRes = await API.get(process.env.apiGateway.NAME, "/users", allUsersInit)
  const paths = []
  getAllUsersRes.body.Items.map(user => {
    if (user.topics) {
      for (const [uuidKey, topicObj] of Object.entries(user.topics.M)) {
        if (!topicObj.M.draft.BOOL) {
          paths.push({ params: { id: user.Username.S, topic: topicObj.M.title.S } })
        }
      }
      // Object.keys(user.topics.M).map((topic) => {
      //   paths.push({ params: { id: user.Username.S, topic: topic } })
      // })
    } else {
      paths.push({ params: { id: user.Username.S, topic: "" } })
    }
  })

  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  let topic
  const specificUserInit = { headers: { Authorization: params.id } }
  const getUserRes = await API.get(process.env.apiGateway.NAME, "/users", specificUserInit)
  const userRes = getUserRes.Item

  const TAVS = []
  userRes.deviceInput.M.text.BOOL && TAVS.push("📝")
  userRes.deviceInput.M.audio.BOOL && TAVS.push("📞")
  userRes.deviceInput.M.video.BOOL && TAVS.push("📹")
  userRes.deviceInput.M.screen.BOOL && TAVS.push("💻")
  const topicsArray = []
  for (const [key, topicObj] of Object.entries(userRes.topics?.M)) {
    if (!topicObj.M.draft.BOOL) {
      topicsArray.push({...topicObj.M, topicId: key})
    }
  }
  const user = {
    Username: userRes.Username.S,
    active: userRes.active.BOOL,
    busy: userRes.busy.BOOL,
    folders: userRes.folders?.SS || [],
    TAVS: TAVS,
    ppm: userRes.ppm.N,
    ratingAv: userRes.ratingAv?.S || null,
    publicString: userRes.publicString?.S || null,
    topics: topicsArray || null,
    receiver: userRes.receiver.BOOL
  }

    user.topics.forEach( async (topicObj) => {
    const title = topicObj.title.S
    const string = topicObj.string.S

    // const draft = topicObj.draft.BOOL
    const topicId = topicObj.topicId
    if (title === params.topic) {

      const titleWithSpaces = title.replace(/-/g, ' ')
      const h2Index = string.indexOf('<h2>')
      const h2IndexEnd = string.indexOf('</h2>', h2Index)
      const h2Description = string.slice(h2Index + 4, h2IndexEnd)
      const description = (h2Index > -1) ? h2Description : 'no description provided'

      const keysNowStrings = string ? KeyToImage(string) : null
      // console.log(keysNowStrings)
      // } catch (err) {
      //   console.log(err)
      // }
      // const firstImageBeginning = keysNowStrings.indexOf('<img')
      // const firstImageEnd = keysNowStrings.indexOf('/>', firstImageBeginning)
      // const firstImage = keysNowStrings.slice(firstImageBeginning + 10, firstImageEnd - 2)
      // const imageMeta = (firstImageBeginning > - 1) ? firstImage : 'no image provided'
      topic = {
        topicId: topicId,
        title: titleWithSpaces,
        string: string,
        stringNoKeys: keysNowStrings,
        description: description,
        // draft: draft
        // firstImage: imageMeta
      }
    }
  })

  return {
    props: { user: user, topic: topic },
    revalidate: 1
  }
}