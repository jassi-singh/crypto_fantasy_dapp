import { useDisclosure } from '@chakra-ui/react'
import Moralis from 'moralis'
import React, { useState, useEffect } from 'react'
import {
  useMoralis,
  useMoralisQuery,
  useWeb3ExecuteFunction,
} from 'react-moralis'
import useSWR from 'swr'
import { contractABI, contractAddress } from '../lib/constants'

export const contractProvider = React.createContext({})
export enum Status {
  pending,
  success,
  failed,
}
export const ContractProvider = ({ children }: any) => {
  const [isOwner, setIsOwner] = useState(false)
  const { isWeb3Enabled, account } = useMoralis()
  const [isLoading, setIsLoading] = useState(false)
  const contractProcessor = useWeb3ExecuteFunction()
  const { data: upcoming, error: upcomingError } = useSWR([
    '/matches/list',
    { matchState: 'upcoming' },
  ])
  const { data: live, error: liveError } = useSWR([
    '/matches/list',
    { matchState: 'live' },
  ])
  const { data: past, error: pastError } = useSWR([
    '/matches/list',
    { matchState: 'past' },
  ])
  const [allContestByMatchId, setAllContestByMatchId] = useState<
    Map<string, any>
  >(new Map())
  const [transaction, setTransaction] = useState<{
    title: string
    data: any
    status: Status
  }>()
  const { data: allContestsDB } = useMoralisQuery(
    'totalContests',
    (query) => query,
    [50],
    {
      live: true,
    }
  )

  const {
    isOpen: isTransactionPending,
    onOpen,
    onClose: onStatusModalClose,
  } = useDisclosure()

  /// USE EFFECTS

  useEffect(() => {
    console.log(upcoming)
  }, [upcoming])

  useEffect(() => {
    console.log('contests updated')
    allContestsDB.map((contest) => {
      const data = contest.toJSON()
      setAllContestByMatchId((prev) => {
        const newMap = new Map(prev)
        newMap.set(data?.apiMatchId, data)
        return newMap
      })
    })
  }, [allContestsDB])

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

  ///Functions

  const createContest = async (params: {
    matchId: string
    fee: string
    startDateTime: number
    endDateTime: number
    joinDeadline: number
  }) => {
    setIsLoading(true)
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
    setTransaction({
      title: 'Creating Contest',
      data: tx,
      status: Status.pending,
    })
    await tx
      ?.wait()
      .then((result: any) => {
        setTransaction({
          title: 'Contest Created',
          data: result,
          status: Status.success,
        })
      })
      .catch((err: any) => {
        console.error(err)
        setTransaction((prev) => {
          const newVal = {
            title: 'Contest Creation Failed',
            data: prev?.data,
            status: Status.failed,
          }
          return newVal
        })
      })
  }

  const joinContest = async (matchId: any, players: Array<number>) => {
    setIsLoading(true)
    const contest = allContestByMatchId?.get(matchId.toString())
    const params = {
      contestId: contest?.contestId,
      playerIds: players,
    }
    console.log(params)
    const tx: any = await contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'joinMatch',
        params: params,
        msgValue: contest?.entryFee,
      },
      onError: (err: any) => {
        console.log('Error from join match', err)
      },
      onComplete: () => {
        setIsLoading(false)
      },
    })

    onOpen()
    setTransaction({
      title: 'Joining Contest',
      data: tx,
      status: Status.pending,
    })
    await tx
      ?.wait()
      .then((result: any) => {
        setTransaction({
          title: 'Contest Joined',
          data: result,
          status: Status.success,
        })
      })
      .catch((err: any) => {
        console.error(err)
        setTransaction((prev) => {
          const newVal = {
            title: 'Contest Joining Failed',
            data: prev?.data,
            status: Status.failed,
          }
          return newVal
        })
      })
  }

  const getOracleData = async (contestId: any) => {
    setIsLoading(true)
    const params = {
      contestId: contestId,
    }
    console.log(params)
    const tx: any = await contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'getContestData',
        params: params,
      },
      onError: (err: any) => {
        console.log('Error from getOracleData', err)
      },
      onComplete: () => {
        setIsLoading(false)
      },
    })

    onOpen()
    setTransaction({
      title: 'Sending Request to Oracle for contest Data',
      data: tx,
      status: Status.pending,
    })
    await tx
      ?.wait()
      .then((result: any) => {
        setTransaction({
          title: 'Request Sent',
          data: result,
          status: Status.success,
        })
      })
      .catch((err: any) => {
        console.error(err)
        setTransaction((prev) => {
          const newVal = {
            title: 'Request Failed',
            data: prev?.data,
            status: Status.failed,
          }
          return newVal
        })
      })
  }

  const findWinner = async (contestId: any, matchId: any) => {
    setIsLoading(true)
    const params = {
      contestId: contestId,
    }
    console.log(params)
    const tx: any = await contractProcessor.fetch({
      params: {
        abi: contractABI,
        contractAddress: contractAddress,
        functionName: 'findWinner',
        params: params,
      },
      onError: (err: any) => {
        console.log('Error from Find Winner', err)
      },
      onComplete: () => {
        setIsLoading(false)
      },
    })

    onOpen()
    setTransaction({
      title: 'Finding Winner of the contest',
      data: tx,
      status: Status.pending,
    })
    await tx
      ?.wait()
      .then((result: any) => {
        setTransaction({
          title: `Winner is Declared Check Participant list`,
          data: result,
          status: Status.success,
        })
      })
      .catch((err: any) => {
        console.error(err)
        setTransaction((prev) => {
          const newVal = {
            title: 'Failed',
            data: prev?.data,
            status: Status.failed,
          }
          return newVal
        })
      })
  }

  return (
    <contractProvider.Provider
      value={{
        isOwner,
        isLoading,
        isTransactionPending,
        transaction,
        allContestByMatchId,
        upcoming,
        upcomingError,
        live,
        liveError,
        past,
        pastError,
        getOracleData,
        findWinner,
        onStatusModalClose,
        createContest,
        joinContest,
      }}
    >
      {children}
    </contractProvider.Provider>
  )
}
