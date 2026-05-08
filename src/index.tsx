import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Tira } from './Tira'
import './index.css'

const el = document.getElementById('root')!
const app = (
  <StrictMode>
    <div className="h-screen w-screen overflow-hidden grid grid-rows-2 place-items-center gap-4">
      <Tira />
    </div>
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(el)).render(app)
