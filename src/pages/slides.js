import React from 'react'
import { useRouter } from 'next/router'
import { RevealMain, Section, Slides } from "~/components/Reveal"

export default function Home() {
  const router = useRouter();
  const { data } = router.query;
  console.log(data)


  if(data)
  return (
    <RevealMain>
      <Slides>
        {data && data.split('---\n').map((slide, index) => {
          return (
            <Section data-background-opacity="0.5" key={index}>
              <div dangerouslySetInnerHTML={{ __html: slide }}/>
            </Section>
          );
        })}
      </Slides>

      <style jsx global>
        {`
        section {
          text-align: left !important;
        }
        p {
          font-size: 0.7em;
        }
        img {
        position: fixed;
        top:0;
        right:0;
        object-fit: cover;
        }
        `}
      </style>
    </RevealMain>
  )
  return (
    <h3>error</h3>
  )
}
