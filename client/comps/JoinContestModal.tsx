import {
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Button,
  Text,
  useColorModeValue,
  Box,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Icon,
  Tag,
  IconButton,
  AvatarBadge,
  Flex,
  useColorMode,
  Center,
  Spinner,
} from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'
import useSWR from 'swr'
import { contractProvider } from '../contextApi/contractProvider'

const JoinContestModal = ({ matchData, onClose }: any) => {
  const { joinContest }: any = useContext(contractProvider)
  const { data: players1, error: error1 } = useSWR([
    '/matches/get-team',
    { matchId: matchData?.matchId, teamId: matchData?.team1?.teamId },
  ])
  const { data: players2, error: error2 } = useSWR([
    '/matches/get-team',
    { matchId: matchData?.matchId, teamId: matchData?.team2?.teamId },
  ])
  const onJoin = () => {
    const players: Array<number> = []
    myTeam1.map((i) => players.push(parseInt(i.id)))
    myTeam2.map((i) => players.push(parseInt(i.id)))

    joinContest(matchData?.matchId, players)
    onClose()
  }

  const [myTeam1, setMyTeam1] = useState<Array<any>>([])
  const [myTeam2, setMyTeam2] = useState<Array<any>>([])

  useEffect(() => {
    console.log(players1)
  }, [players1])

  return (
    <ModalContent>
      <ModalHeader>
        Select Players
        <Text fontSize="xs">At least 4 from each team and total 11</Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {/* {!players1 && !players1?.player ? <Center>Teams not declared yet</Center>: */}
        <Tabs colorScheme="purple" isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>{matchData?.team1.teamSName}</Tab>
            <Tab>{matchData?.team2.teamSName}</Tab>
            <Tab>
              <Flex>
                Your Team{' '}
                <Box ml="2" textColor="purple.500">
                  {myTeam1.length + myTeam2.length}
                </Box>
              </Flex>
            </Tab>
          </TabList>
          <TabPanels overflow="auto" height={96}>
            <TabPanel>
              {players1 ? (
                players1?.player ? (
                  players1?.player[0]?.player?.map((player: any) => (
                    <Box
                      key={player?.id}
                      shadow="lg"
                      borderRadius="lg"
                      m="4"
                      p="4"
                      bg={useColorModeValue('white', 'gray.800')}
                      display="flex"
                      justifyContent="space-between"
                      cursor="pointer"
                      aria-selected={myTeam1.some((e) => e.id === player?.id)}
                      aria-disabled={
                        (myTeam1.length === 7 ||
                          myTeam1.length + myTeam2.length === 11) &&
                        !myTeam1
                          .map(function (x) {
                            return x.id
                          })
                          .includes(player.id)
                      }
                      _disabled={{ opacity: '0.5', pointerEvents: 'none' }}
                      _hover={{ bg: 'purple.300' }}
                      _selected={{ boxShadow: 'outline' }}
                      onClick={async () => {
                        setMyTeam1((prev) => {
                          const idx = prev
                            .map(function (x) {
                              return x.id
                            })
                            .indexOf(player.id)
                          const newArray = [...prev]
                          if (idx == -1) newArray.push(player)
                          else newArray.splice(idx, 1)
                          return newArray
                        })
                      }}
                    >
                      <Text>{player?.name}</Text>
                      <Tag colorScheme="purple">{player?.role}</Tag>
                    </Box>
                  ))
                ) : (
                  <Center>Team Not declared yet</Center>
                )
              ) : (
                <Center>
                  <Spinner />
                </Center>
              )}
            </TabPanel>
            <TabPanel>
              {players2?.player ? (
                players2?.player[0]?.player?.map((player: any) => (
                  <Box
                    key={player?.id}
                    shadow="lg"
                    borderRadius="lg"
                    m="4"
                    p="4"
                    bg={useColorModeValue('white', 'gray.800')}
                    display="flex"
                    justifyContent="space-between"
                    cursor="pointer"
                    aria-selected={myTeam2.some((e) => e.id === player?.id)}
                    aria-disabled={
                      (myTeam2.length === 7 ||
                        myTeam1.length + myTeam2.length === 11) &&
                      !myTeam2
                        .map(function (x) {
                          return x.id
                        })
                        .includes(player.id)
                    }
                    _disabled={{ opacity: '0.5', pointerEvents: 'none' }}
                    _hover={{ bg: 'purple.300' }}
                    _selected={{ boxShadow: 'outline' }}
                    onClick={async () => {
                      setMyTeam2((prev) => {
                        const idx = prev
                          .map(function (x) {
                            return x.id
                          })
                          .indexOf(player.id)
                        const newArray = [...prev]
                        if (idx == -1) newArray.push(player)
                        else newArray.splice(idx, 1)
                        return newArray
                      })
                    }}
                  >
                    <Text>{player?.name}</Text>
                    <Tag colorScheme="purple">{player?.role}</Tag>
                  </Box>
                ))
              ) : (
                <Center>Team Not declared yet</Center>
              )}
            </TabPanel>
            <TabPanel>
              {myTeam1.map((player: any) => (
                <Box
                  key={player?.id}
                  shadow="lg"
                  borderRadius="lg"
                  m="4"
                  px="4"
                  py="2"
                  bg={useColorModeValue('white', 'gray.800')}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <HStack>
                    <Text>{player?.name}</Text>
                    <Tag>{player?.teamName}</Tag>
                  </HStack>
                  <HStack>
                    <Tag colorScheme="purple">{player?.role}</Tag>
                    <IconButton
                      aria-label="remove-current-player from team"
                      icon={<AiOutlineClose />}
                      onClick={() => {
                        setMyTeam1((prev) => {
                          const idx = prev
                            .map(function (x) {
                              return x.id
                            })
                            .indexOf(player.id)
                          const newArray = [...prev]
                          newArray.splice(idx, 1)
                          return newArray
                        })
                      }}
                    />
                  </HStack>
                </Box>
              ))}
              {myTeam2.map((player: any) => (
                <Box
                  key={player?.id}
                  shadow="lg"
                  borderRadius="lg"
                  m="4"
                  px="4"
                  py="2"
                  bg={useColorModeValue('white', 'gray.800')}
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <HStack>
                    <Text>{player?.name}</Text>
                    <Tag>{player?.teamName}</Tag>
                  </HStack>
                  <HStack>
                    <Tag colorScheme="purple">{player?.role}</Tag>
                    <IconButton
                      aria-label="remove-current-player from team"
                      icon={<AiOutlineClose />}
                      onClick={() => {
                        setMyTeam2((prev) => {
                          const idx = prev
                            .map(function (x) {
                              return x.id
                            })
                            .indexOf(player.id)
                          const newArray = [...prev]
                          newArray.splice(idx, 1)
                          return newArray
                        })
                      }}
                    />
                  </HStack>
                </Box>
              ))}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalBody>

      <ModalFooter>
        <Button
          colorScheme="purple"
          mr={3}
          onClick={onJoin}
          disabled={myTeam1.length + myTeam2.length !== 11}
        >
          Join
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default JoinContestModal
