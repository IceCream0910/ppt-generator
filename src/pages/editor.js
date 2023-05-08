import React, { useEffect } from "react"
import { useState } from "react"
import { useRouter } from 'next/router'
import TextField from "@mui/material/TextField"
import Button from "@mui/material/Button"
import IonIcon from "@reacticons/ionicons"

export default function Home() {
  const router = useRouter();
  var { data } = router.query;

  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [h2Values, setH2Values] = useState([]);
  const [pValues, setPValues] = useState([]);
  const [lastSave, setLastSave] = useState('');


  useEffect(() => {
    if (data) {
      const splitText = data.split("---\n");
      setSlides(splitText);

      splitText.forEach((slideText, index) => {
        if (index === 0) {
          setTitle(slideText.match(/<h2>(.*)<\/h2>/)[1]);
          return;
        }
        const h2Match = slideText.match(/<h2>(.*)<\/h2>/);
        setH2Values(prevH2Values => [...prevH2Values, h2Match[1]]);

        const pMatch = slideText.match(/<p>(.*)<\/p>/);
        setPValues(prevPValues => [...prevPValues, pMatch[1]]);
      });
    }

    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    setLastSave(now);
    localStorage.setItem('lastSlide_data', data);

  }, []);


  const save = () => {
    let finalResult = '';
    finalResult += `<h2>${title}</h2>\n---\n`;
    slides.forEach((slide, index) => {
        if(index === 0) return;
        finalResult += `<h2>${h2Values[index - 1]}</h2>\n<p>${pValues[index - 1]}</p>\n---\n`
      }
    )
    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    setLastSave(now);

    localStorage.setItem('lastSlide_data', finalResult);
  }

  const complete = () => {
    let finalResult = '';
    finalResult += `<h2>${title}</h2>\n---\n`;
    slides.forEach((slide, index) => {
      if(index === 0) return;
      finalResult += `<h2>${h2Values[index - 1]}</h2>\n<p>${pValues[index - 1]}</p>\n---\n`
    }
    )

    const now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    setLastSave(now);
    localStorage.setItem('lastSlide_data', finalResult);

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
          <Button variant="text" onClick={() => router.back()}>
            <IonIcon style={{marginTop: '-10px', fontSize: '20px'}} name="chevron-back" />&nbsp;&nbsp;처음으로
          </Button>

          <div style={{display:'flex', flexDirection: 'row', gap: '15px', height: '30px', alignItems: 'center'}}>
            {lastSave && <span style={{ opacity: "0.8", color: '#a9a9a9' }}>마지막 수정 : {lastSave}</span>}
            <Button variant="outlined" onClick={() => save()}>
              <IonIcon style={{marginTop: '-10px', fontSize: '20px'}} name="save-outline" />&nbsp;&nbsp;저장
            </Button>
            <Button variant="outlined" onClick={() => complete()}>
              <IonIcon style={{marginTop: '-10px', fontSize: '20px'}} name="expand" />&nbsp;&nbsp;슬라이드쇼 시작
            </Button>
          </div>

        </div>

        <br/><br/>

        {title && <TextField label="프리젠테이션 제목" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />}

        {slides.map((slide, index) => {
          return (
            <div className={'slide-container'} key={index}>
              <label style={{color: '#ccc'}}>슬라이드{index+1}</label>
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
            overflow: scroll;
          }

          .header {
            display: flex;
            justify-content: space-between;
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background-color: rgba(28, 30, 32, 0.8);
            backdrop-filter: blur(10px);
            z-index: 10;
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

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}
