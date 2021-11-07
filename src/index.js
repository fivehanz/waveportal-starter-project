import * as React from "react"
import ReactDOM from 'react-dom';

import App from './App';

// 1. import `ChakraProvider` component
import { ChakraProvider } from "@chakra-ui/react"

export default function Index() {
  // 2. Use at the root of your app
  return (
    <ChakraProvider>
      <App />
    </ChakraProvider>
  )
}

ReactDOM.render(<Index />, document.getElementById('root'));


