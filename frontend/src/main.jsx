import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import 'bootstrap/dist/css/bootstrap.min.css' // Importar Bootstrap
import { BrowserRouter } from 'react-router-dom'
import './styles/index.css' // Importar el CSS global

const root = ReactDOM.createRoot(document.getElementById('root'))


root.render(
    <BrowserRouter>
      <div className="app">
        <div className="main-container">
          <App />
        </div>
      </div>
    </BrowserRouter>
  )
  