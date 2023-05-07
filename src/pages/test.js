import React from 'react'
import Pages from '../components/pages'
import {useState} from "react"
import { useRouter } from 'next/router'
import { RevealMain, Section, Slides } from "~/components/Reveal"
import PageHome from '../content-pages/home'

export default function Home() {

  return(
    <PageHome/>
  )
}
