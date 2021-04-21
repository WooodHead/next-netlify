import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SplashPage() {
  return (
    <div className="mx-5 my-5">
      <h1 className="mx-5 my-4 mt-10">create a page, write stuff</h1>
      <h1 className="mx-5 my-4">get found on google</h1>
      <h1 className="mx-5 my-4 mb-10">make money maybe</h1>
      <Link className="mx-5 my-5" href="/6779991/How-to-upload-images-to-S3-using-Quill,-React,-Next,-and-Amp">
        <button>see example user</button>
      </Link>
      {/* <Image src="https://talktreeimagespublic.s3.amazonaws.com/2_1.jpg" alt="testImage" width={500} height={500} /> */}
    </div>
    


  )
}