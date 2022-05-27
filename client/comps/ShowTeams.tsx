import {
  Box,
  Button,
  HStack,
  Icon,
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
import { FaCrown } from 'react-icons/fa'
import Jazzicon from 'react-jazzicon'
import { useMoralis, useMoralisQuery } from 'react-moralis'

const ShowTeams = ({ onClose, contest }: any) => {
  const { data, isLoading } = useMoralisQuery('allTeams', (query) =>
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
        <Text fontSize={'xs'}>
          Scores & Winner will be calculated after the match is over
        </Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {contest?.winner.toLowerCase() !==
          '0x0000000000000000000000000000000000000000' && (
          <HStack
            shadow="lg"
            borderRadius="lg"
            m="4"
            p="4"
            bg={useColorModeValue('yellow.300', 'yellow.500')}
          >
            <Box>
              <Icon color={'white'} as={FaCrown}></Icon>
            </Box>
            <HStack>
              <Jazzicon
                diameter={35}
                seed={parseInt(contest?.winner?.substring(0, 16) ?? '', 16)}
              />
              <Text fontStyle={'italic'} fontWeight="medium" fontSize={'xs'}>
                {contest?.winner}
              </Text>
            </HStack>
            <Stat display={'flex'} justifyContent="flex-end">
              <StatNumber fontSize="sm">
                #{teams.get(contest?.winner.toLowerCase())?.teamScores ?? 'NA'}
              </StatNumber>
              <StatLabel fontSize="xs">Score</StatLabel>
            </Stat>
          </HStack>
        )}
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
