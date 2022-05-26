import {
  Box,
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import Jazzicon from 'react-jazzicon'
import { useMoralis, useMoralisQuery } from 'react-moralis'

const ShowTeams = ({ onClose, contest }: any) => {
  const { data, isLoading } = useMoralisQuery('contestTeams', (query) =>
    query.equalTo('contestId', contest?.contestId)
  )
  const [teams, setTeams] = useState(new Map<string, any>())
  useEffect(() => {
    data.map((team) => {
      const json = team.toJSON()
      setTeams((prev) => {
        const newMap = new Map(prev)
        newMap.set(json?.teamOwner?.toLowerCase(), json)
        return newMap
      })
    })
  }, [data])

  return (
    <ModalContent>
      <ModalHeader>
        Participants of Contest #{contest?.contestId}
        <Text fontSize={'xs'}>Scores & Winner will be calculated after the match is over</Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {contest?.teamOwners.map((owner: any) => (
          <Skeleton isLoaded={!isLoading}>
            <HStack
              shadow="lg"
              borderRadius="lg"
              m="4"
              p="4"
              bg={useColorModeValue('white', 'gray.900')}
            >
              <HStack>
                <Jazzicon
                  diameter={35}
                  seed={parseInt(owner?.substring(0, 16) ?? '', 16)}
                />
                <Text fontStyle={'italic'} fontWeight="medium" fontSize={'xs'}>
                  {owner}
                </Text>
              </HStack>
              <Stat display={'flex'} justifyContent="flex-end">
                <StatNumber fontSize="sm">
                  #{teams.get(owner.toLowerCase())?.teamScores ?? 'NA'}
                </StatNumber>
                <StatLabel fontSize="xs">Score</StatLabel>
              </Stat>
            </HStack>
          </Skeleton>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default ShowTeams
