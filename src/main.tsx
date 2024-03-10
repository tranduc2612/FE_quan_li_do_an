import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import GlobalStyle from './components/GlobalStyle/index.tsx'
import { LocalizationProvider, viVN } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <Provider store={store}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-gb' localeText={viVN.components.MuiLocalizationProvider.defaultProps.localeText}>
          <GlobalStyle>
            <App />
          </GlobalStyle>
        </LocalizationProvider>
        </Provider>
  </React.StrictMode>,
)
