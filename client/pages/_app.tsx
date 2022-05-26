import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import Layout from '../comps/Layout'
import { MoralisProvider } from 'react-moralis'
import process from 'process'
import React from 'react'
import { SWRConfig } from 'swr'
import axios from 'axios'
import { axiosInitialParams } from '../utills/utills'
import { ContractProvider } from '../contextApi/contractProvider'

function MyApp({ Component, pageProps }: any) {
  const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID
  const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
  return (
    <ChakraProvider>
      <SWRConfig
        value={{
          // refreshInterval: 3000,
          errorRetryCount: 1,
          revalidateOnFocus: false,
          fetcher: (resource, params) =>
            axios
              .get(resource, {
                baseURL: axiosInitialParams.baseUrl,
                headers: axiosInitialParams.headers,
                params: params,
              })
              .then((res) => res.data),
        }}
      >
        <MoralisProvider
          appId={APP_ID ?? ''}
          serverUrl={SERVER_URL ?? ''}
          initializeOnMount
        >
          <ContractProvider>
            <div suppressContentEditableWarning>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </div>
          </ContractProvider>
        </MoralisProvider>
      </SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
