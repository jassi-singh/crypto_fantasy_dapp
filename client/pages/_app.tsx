import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Center, ChakraProvider } from '@chakra-ui/react'
import Layout from '../comps/Layout'
import { MoralisProvider } from 'react-moralis'
import process from 'process'
import { Router } from 'next/router'
import React from 'react'
import { SWRConfig } from 'swr'
import axios from 'axios'
import { axiosInitialParams } from '../utills/utills'
import { ContractProvider } from '../contextApi/contractProvider'

function MyApp({ Component, pageProps }: AppProps) {
  const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID
  const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL
  const [loading, setLoading] = React.useState(false)

  // React.useEffect(() => {
  //   const start = () => {
  //     console.log('start')
  //     setLoading(true)
  //   }
  //   const end = () => {
  //     console.log('findished')
  //     setLoading(false)
  //   }
  //   Router.events.on('routeChangeStart', start)
  //   Router.events.on('routeChangeComplete', end)
  //   Router.events.on('routeChangeError', end)
  //   return () => {
  //     Router.events.off('routeChangeStart', start)
  //     Router.events.off('routeChangeComplete', end)
  //     Router.events.off('routeChangeError', end)
  //   }
  // }, [])
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
                {loading ? (
                  <Center height="full">Loading...</Center>
                ) : (
                  <Component {...pageProps} />
                )}
              </Layout>
            </div>
          </ContractProvider>
        </MoralisProvider>
      </SWRConfig>
    </ChakraProvider>
  )
}

export default MyApp
