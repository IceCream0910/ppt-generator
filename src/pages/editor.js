import React, { useEffect } from "react"
import Pages from '../components/pages'
import { useState } from "react"
import { useRouter } from 'next/router'
import { RevealMain, Section, Slides } from "~/components/Reveal"
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IonIcon from "@reacticons/ionicons"

export default function Home() {
  const router = useRouter();
  const { data } = router.query;
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [h2Values, setH2Values] = useState([]);
  const [pValues, setPValues] = useState([]);


  useEffect(() => {
    const splitText = data.split("---\n");
    setSlides(splitText);
    console.log(splitText)

    splitText.forEach((slideText, index) => {
      console.log(slideText, index)
      if(index === 0) {
        setTitle(slideText.match(/<h2>(.*)<\/h2>/)[1])
        return;
      }
      const h2Match = slideText.match(/<h2>(.*)<\/h2>/);
      setH2Values(prevH2Values => [...prevH2Values, h2Match[1]])

      const pMatch = slideText.match(/<p>(.*)<\/p>/);
      setPValues(prevPValues => [...prevPValues, pMatch[1]])
    });
  }, []);

  const complete = () => {
    let finalResult = '';
    finalResult += `<h2>${title}</h2>\n---\n`;
    slides.forEach((slide, index) => {
      if(index === 0) return;
      finalResult += `<h2>${h2Values[index - 1]}</h2>\n<p>${pValues[index - 1]}</p>\n---\n`
    }
    )

    router.push({
      pathname : '/slides',
      query : {
        data : finalResult
      },
    }, "/slides")
  }




  if (data) {
    return (
      <div className={'main-container'}>
        <div className={'header'}>
          <Button variant="contained" onClick={() => complete()}>
            <IonIcon style={{marginTop: '-10px', fontSize: '20px'}} name="arrow-forward" />&nbsp;&nbsp;완료
          </Button>
        </div>

        <TextField label="프리젠테이션 제목" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />

        {slides.map((slide, index) => {
          return (
            <div className={'slide-container'} key={index}>
              <TextField
                label="제목"
                defaultValue={h2Values[index]}
                onChange={(event) => {
                  const newH2Values = [...h2Values];
                  newH2Values[index] = event.target.value;
                  setH2Values(newH2Values);
                }}
              />
              <TextField
                label="내용"
                multiline
                defaultValue={pValues[index]}
                onChange={(event) => {
                  const newPValues = [...pValues];
                  newPValues[index] = event.target.value;
                  setPValues(newPValues);
                }}
              />

            </div>
          )
        })}
        <style jsx>{`
          .main-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            justify-content: center;
            padding: 50px;
            background: #1c1e20;
          }

          .slide-container {
            display: flex;
            flex-direction: column;
            gap: 20px;
            width: 100%;
            background-color: #2c2e30;
            padding: 20px;
            border-radius: 10px;
          }

        `}
        </style>
      </div>
    )
  }
  return (
    <h3>error</h3>
  )
}
