import React, { useEffect } from "react"
import { useState } from 'react';
import { useRouter } from 'next/router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Section, Slides } from "~/components/Reveal"

export default function Home() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [html, setHtml] = useState('');
  const [progress, setProgress] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const send = async () => {
    setResult('')
    let messages = [];
    messages.unshift({role: "system", content: `
    Generate around 10 slides in korean.
You do not need to add any additional replies or explanations.
I will offer you subject of presentation.
First, you should generate the Global title of the presentation.
Each title corresponds to one content page, with a maximum of 100 words per page. Conciseness is key. Content of slides should be form of simple sentences.
The dividing line between slides is "---" necessarily.

This is example:
<h2>Global Title</h2>
---
<h2>Slide Title</h2>
<p>Content</p>
---
<h2>Slide Title</h2>
<p>Content</p>
`});
    messages.push({role: "user", content: `
    Subject : ${prompt}.\n\n
    `});

    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 100);
      });
    }, 3000);
    setIsDisabled(true);
    handleOpen();
    await fetch(
      'https://openai.a2hosted.com/chat?q=' + encodeURIComponent(JSON.stringify(messages))
    ).then(response => {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let finalResult = ''

      async function readChunks() {
        let result = await reader.read();
        while (!result.done) {
          const data = decoder.decode(result.value, { stream: true });
          const parsedData = data.replaceAll('data: ', '').trim().split('\n');
          parsedData.forEach((item, index) => {
            if(data && isJson(item)) {
              if (JSON.parse(item).msg) {
                finalResult = finalResult + JSON.parse(item).msg;
                setResult(prevStreamingData => prevStreamingData + JSON.parse(item).msg);
              }
            }
          });
          result = await reader.read();
        }
        console.log('done', result);
        router.push({
          pathname : '/editor',
          query : {
            data : finalResult
          },
        }, "/editor")
      }

      readChunks();
    }).catch(error => {
        console.error(error);
      });
  }


  return (
    <>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            슬라이드를 만들고 있어요..
          </Typography>
          <p>오래 걸릴 수도 있어요. 조금만 기다려주세요</p>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
      </Modal>


      <div className={'main-container'}>
      <TextField fullWidth label="주제" id="fullWidth" onChange={() => setPrompt(event.target.value)} style={{borderRadius: '20px 0 0 20px'}}/>
      <Button variant="contained" onClick={() => send()} style={{width: '70px', height: '55px', borderRadius: '0 20px 20px 0'}}
      disabled={isDisabled}>생성</Button>

      <style jsx>{`
        .main-container {
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          height: 100vh;
          width: 100vw;
          padding:50px;
          background:#1c1e20;
        }
      `}
      </style>
    </div>
    </>
  )
}
