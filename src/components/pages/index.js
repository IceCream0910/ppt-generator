import React from 'react'

import { RevealMain, Slides, Section } from '../Reveal'

export default function PageHome() {
  return (

    <RevealMain>
      <Slides>
        <Section data-background-opacity="0.5">
          <h2>자율주행 기술의 발전</h2>
          <p>센서 기술의 발전<br/>
            인공지능과 머신 러닝의 적용<br/>
            로봇택시와 같은 시범 서비스의 등장</p>
        </Section>
      </Slides>
      <style jsx global>
        {`
        section {
          text-align: left !important;
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
}
