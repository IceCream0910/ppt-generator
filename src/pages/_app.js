/* eslint-disable react/prop-types */
import '../components/Reveal/revealjs/css/reveal.css'
import '../components/Reveal/revealjs/css/theme/black.css'
import ThemeContainer from '../components/ThemeContainer'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  },
  shape: {
    borderRadius: 8,
  }
});

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
