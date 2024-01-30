import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'
import GlobalStyle from './components/GlobalStyle/index.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <GlobalStyle>
        <App />
      </GlobalStyle>
    </Provider>
  </React.StrictMode>,
)
