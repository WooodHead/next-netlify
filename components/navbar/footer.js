import Link from 'next/link'
import React from 'react'

const FooterComp =()=> {
  return (
    <div className="flex justify-center mb-5">
      <Link href="/about"><a>about</a></Link>
    </div>
  )
}

export default FooterComp