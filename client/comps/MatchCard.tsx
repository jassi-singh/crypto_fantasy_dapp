import {
  Box,
  HStack,
  Stat,
  useColorModeValue,
  StatLabel,
  Text,
  StatNumber,
  Button,
  Tag,
  Modal,
  ModalOverlay,
  useDisclosure,
  VStack,
  Spacer,
} from '@chakra-ui/react'
import Moralis from 'moralis'
import React, { useContext, useEffect, useState } from 'react'
import { getChain, useMoralis } from 'react-moralis'
import { useTimer } from 'react-timer-hook'
import { contractProvider } from '../contextApi/contractProvider'
import CreateContestModal from './CreateContestModal'
import JoinContestModal from './JoinContestModal'
import ShowTeams from './ShowTeams'

const MatchCard = ({ matchData }: any) => {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp: new Date(parseInt(matchData?.startDate)),
  })
  // const {
  //   seconds: endTimerSeconds,
  //   minutes: endTimerMinutes,
  //   hours: endTimerHours,
  //   days: endTimerDays,
  //   isRunning: endTimerIsRunning,
  // } = useTimer({
  //   expiryTimestamp: new Date(parseInt(matchData?.endDate)),
  // })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isWeb3Enabled, account, chainId } = useMoralis()
  const { isOwner, allContestByMatchId }: any = useContext(contractProvider)
  const [contestData, setContestData] = useState<any>()

  useEffect(() => {
    setContestData(allContestByMatchId.get(matchData?.matchId.toString()))
  }, [allContestByMatchId])

  return (
    <>
      {(contestData?.contestId || isOwner) && (
        <Box
          shadow="lg"
          borderRadius="lg"
          m="4"
          p="4"
          bg={useColorModeValue('white', 'gray.900')}
        >
          <HStack justifyContent="space-between">
            <Text fontSize="xs">{matchData?.matchDesc}</Text>

            <Tag colorScheme="purple" as="em" fontSize="xs">
              {isRunning
                ? `Submission ends in ${days}:${hours}:${minutes}:${seconds}`
                : `Submission Ended`}
            </Tag>
          </HStack>
          <HStack py="2" alignItems="center" justifyContent="space-between">
            <Text fontWeight="semibold">{matchData?.team1?.teamName}</Text>
            <Text fontSize="sm">VS</Text>
            <Text fontWeight="semibold">{matchData?.team2?.teamName}</Text>
          </HStack>
          <HStack pt="2" justifyContent="space-between" alignItems="center">
            <Stat>
              <StatNumber fontSize="sm">
                #{contestData?.contestId ?? 'NA'}
              </StatNumber>
              <StatLabel fontSize="xs">Contest Id</StatLabel>
            </Stat>
            <Stat>
              <StatNumber fontSize="sm">
                {contestData?.totalTeams ?? 'NA'}
              </StatNumber>
              <StatLabel fontSize="xs">
                No. of Participants<sup>*</sup>
              </StatLabel>
            </Stat>
            <Stat>
              <StatNumber fontSize="sm">
                {Moralis.Units.FromWei(contestData?.poolPrize ?? 0)}{' '}
                {getChain(chainId ?? '')?.nativeCurrency.symbol}
              </StatNumber>
              <StatLabel fontSize="xs">Pool Prize</StatLabel>
            </Stat>
            <Stat>
              <StatNumber fontSize="sm">
                {' '}
                {Moralis.Units.FromWei(contestData?.entryFee ?? 0)}{' '}
                {getChain(chainId ?? '')?.nativeCurrency.symbol}
              </StatNumber>
              <StatLabel fontSize="xs">Entry Fee</StatLabel>
            </Stat>
            {isWeb3Enabled &&
              isRunning &&
              (isOwner ? (
                !contestData?.contestId ? (
                  <Button colorScheme="purple" onClick={onOpen}>
                    Create Contest
                  </Button>
                ) : (
                  <Button disabled colorScheme="purple" onClick={onOpen}>
                    Calculate Winner
                  </Button>
                )
              ) : !contestData?.teamOwners?.some(
                  (owner: string) =>
                    owner.toUpperCase() == account?.toUpperCase()
                ) ? (
                <Button colorScheme="purple" onClick={onOpen}>
                  Join Contest
                </Button>
              ) : (
                <Button colorScheme="purple" onClick={onOpen}>
                  Show Participants
                </Button>
              ))}
          </HStack>
        </Box>
      )}

      <Modal
        scrollBehavior="inside"
        size="xl"
        colorScheme="purple"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        {isOwner ? (
          <CreateContestModal onClose={onClose} matchData={matchData} />
        ) : !contestData?.teamOwners?.some(
            (owner: string) => owner.toUpperCase() == account?.toUpperCase()
          ) ? (
          <JoinContestModal onClose={onClose} matchData={matchData} />
        ) : (
          <ShowTeams onClose={onClose} contest={contestData} />
        )}
      </Modal>
    </>
  )
}

export default MatchCard
