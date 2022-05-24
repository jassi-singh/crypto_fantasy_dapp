import { useDisclosure } from '@chakra-ui/react'
import Moralis from 'moralis'
import React, { useState, useEffect } from 'react'
import { useMoralis, useWeb3ExecuteFunction } from 'react-moralis'
import { contractABI, contractAddress } from '../lib/constants'

export const contractProvider = React.createContext({})

export const ContractProvider = ({ children }: any) => {
  const [isOwner, setIsOwner] = useState(false)
  const { isWeb3Enabled, account } = useMoralis()
  const [isLoading, setIsLoading] = useState(false)
  const contractProcessor = useWeb3ExecuteFunction()
  const [transaction, setTransaction] = useState()
  const {
    isOpen: isTransactionPending,
    onOpen,
    onClose: onStatusModalClose,
  } = useDisclosure()

  useEffect(() => {
    contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'owner',
      },
      onSuccess: (data: any) => {
        setIsOwner(data.toString().toLowerCase() === account?.toLowerCase())
      },
    })
  }, [account])

  const createContest = async (params: {
    matchId: string
    fee: string
    startDateTime: number
    endDateTime: number
    joinDeadline: number
  }) => {
    setIsLoading(true)
    console.log('creating contest .....')
    const tx: any = await contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'createContest',
        params: params,
      },
      onError: (err: any) => {
        console.log(err)
      },
      onComplete: () => {
        setIsLoading(false)
      },
    })
    onOpen()
    setTransaction(tx)
    await tx
      ?.wait()
      .then((result: any) => {
        setTransaction(result)
      })
      .catch((err: any) => {
        setTransaction(err)
      })
    // setTransaction(tx)
    // onStatusModalClose()
  }

  const joinContest = async (matchId: any, players: Array<number>) => {
    setIsLoading(true)
    console.log(matchId)
    await contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'contestByMatchId',
        params: { '': matchId },
      },
      onError: (err: any) => {
        console.log('Error from contest by matchid ', err)
      },
      onSuccess: (data: any) => {
        console.log(data.entryFee.toString())
        const params = {
          contestId: data.contestId.toNumber(),
          playerIds: players,
        }
        console.log(params.playerIds)
        contractProcessor.fetch({
          params: {
            abi: contractABI,
            contractAddress: contractAddress,
            functionName: 'joinMatch',
            params: params,
            msgValue: data.entryFee.toString(),
          },
          onError: (err: any) => {
            console.log('Error from join match', err)
          },
          onComplete: () => {
            setIsLoading(false)
          },
        })
      },
    })
  }

  const checkIfContestExistByMatchId = (
    live: any,
    upcoming: any,
    past: any
  ) => {
    const matchIdsToBool = new Map()

    live?.typeMatches?.map((matches: any) =>
      matches?.seriesAdWrapper?.map((item: any) =>
        item?.seriesMatches?.matches?.map((allMatch: any) =>
          matchIdsToBool.set(allMatch?.matchInfo?.matchId, false)
        )
      )
    )
    upcoming?.typeMatches?.map((matches: any) =>
      matches?.seriesAdWrapper?.map((item: any) =>
        item?.seriesMatches?.matches?.map((allMatch: any) =>
          matchIdsToBool.set(allMatch?.matchInfo?.matchId, false)
        )
      )
    )
    past?.typeMatches?.map((matches: any) =>
      matches?.seriesAdWrapper?.map((item: any) =>
        item?.seriesMatches?.matches?.map((allMatch: any) =>
          matchIdsToBool.set(allMatch?.matchInfo?.matchId, false)
        )
      )
    )
    console.log(matchIdsToBool)
    const matchIds = Array.from(matchIdsToBool.keys())
    console.log(matchIds)

    contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'checkContestsExist',
        params: { matchIds: matchIds },
      },
      onError: (err: any) => {
        console.log(err)
      },
      onSuccess: (data: any) => {
        console.log(data)
      },
    })
  }

  return (
    <contractProvider.Provider
      value={{
        isOwner,
        isLoading,
        isTransactionPending,
        transaction,
        onStatusModalClose,
        createContest,
        checkIfContestExistByMatchId,
        joinContest,
      }}
    >
      {children}
    </contractProvider.Provider>
  )
}
