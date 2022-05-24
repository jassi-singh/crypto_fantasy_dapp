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
} from '@chakra-ui/react'
import React, { useContext, useEffect } from 'react'
import { useMoralis } from 'react-moralis'
import { useTimer } from 'react-timer-hook'
import { contractProvider } from '../contextApi/contractProvider'
import CreateContestModal from './CreateContestModal'
import JoinContestModal from './JoinContestModal'

const MatchCard = ({ matchData }: any) => {
  const { seconds, minutes, hours, days, isRunning } = useTimer({
    expiryTimestamp: new Date(parseInt(matchData?.startDate)),
  })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isWeb3Enabled } = useMoralis()
  const { isOwner }: any = useContext(contractProvider)

  return (
    <>
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
            <HStack>
              <StatLabel>Pool Prize</StatLabel>
              <StatNumber fontSize="lg">1.2 MATIC</StatNumber>
            </HStack>
          </Stat>
          <Stat>
            <HStack>
              <StatLabel>Entry Fee</StatLabel>
              <StatNumber fontSize="lg">0.2 MATIC</StatNumber>
            </HStack>
          </Stat>
          {isWeb3Enabled && isRunning &&
            (isOwner ? (
              <Button colorScheme="purple" onClick={onOpen}>
                Create Contest
              </Button>
            ) : (
              <Button colorScheme="purple" onClick={onOpen}>
                Join Contest
              </Button>
            ))}
        </HStack>
      </Box>

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
        ) : (
          <JoinContestModal onClose={onClose} matchData={matchData} />
        )}
      </Modal>
    </>
  )
}

export default MatchCard
