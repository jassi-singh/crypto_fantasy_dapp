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
} from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import { AiOutlineClose } from 'react-icons/Ai'
import { contractProvider } from '../contextApi/contractProvider'

const JoinContestModal = ({ matchData, onClose }: any) => {
  const { joinContest }: any = useContext(contractProvider)
  const onJoin = async () => {
    const players: Array<number> = []
    myTeam1.map((i) => players.push(parseInt(i.id)))
    myTeam2.map((i) => players.push(parseInt(i.id)))

    await joinContest(matchData?.matchId, players)
    onClose()
  }

  const players1 = [
    {
      id: '11808',
      name: 'Shubman Gill',
      role: 'Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '171042',
    },
    {
      id: '13866',
      name: 'Sai Sudharsan',
      role: 'Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '182026',
    },
    {
      id: '10499',
      name: 'Abhinav Manohar',
      role: 'Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '182026',
    },
    {
      id: '6349',
      name: 'David Miller',
      role: 'Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '170687',
    },
    {
      id: '1649',
      name: 'Matthew Wade',
      role: 'WK-Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '156205',
    },
    {
      id: '1465',
      name: 'Wriddhiman Saha',
      role: 'WK-Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '171058',
    },
    {
      id: '9647',
      name: 'Hardik Pandya',
      captain: true,
      role: 'Batting Allrounder',
      teamName: 'Gujarat Titans',
      faceImageId: '170666',
    },
    {
      id: '13750',
      name: 'Dominic Drakes',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '226329',
    },
    {
      id: '8204',
      name: 'Vijay Shankar',
      role: 'Batting Allrounder',
      teamName: 'Gujarat Titans',
      faceImageId: '170664',
    },
    {
      id: '8182',
      name: 'Jayant Yadav',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '226388',
    },
    {
      id: '8298',
      name: 'Gurkeerat Singh Mann',
      role: 'Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '226548',
    },
    {
      id: '9693',
      name: 'Rahul Tewatia',
      role: 'Batting Allrounder',
      teamName: 'Gujarat Titans',
      faceImageId: '196288',
    },
    {
      id: '10738',
      name: 'Rashid Khan',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '170857',
    },
    {
      id: '6293',
      name: 'Varun Aaron',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '171087',
    },
    {
      id: '12779',
      name: 'Darshan Nalkande',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '182026',
    },
    {
      id: '14172',
      name: 'Yash Dayal',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '182026',
    },
    {
      id: '1472',
      name: 'Pradeep Sangwan',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '153373',
    },
    {
      id: '11220',
      name: 'Alzarri Joseph',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '152877',
    },
    {
      id: '11595',
      name: 'Ravisrinivasan Sai Kishore',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '226507',
    },
    {
      id: '15452',
      name: 'Noor Ahmad',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '226316',
    },
    {
      id: '10692',
      name: 'Lockie Ferguson',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '170749',
    },
    {
      id: '7909',
      name: 'Mohammed Shami',
      role: 'Bowler',
      teamName: 'Gujarat Titans',
      faceImageId: '170684',
    },
    {
      id: '13213',
      name: 'Rahmanullah Gurbaz',
      role: 'WK-Batsman',
      teamName: 'Gujarat Titans',
      faceImageId: '226320',
    },
  ]

  const players2 = [
    {
      id: '8257',
      name: 'Karun Nair',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '152760',
    },
    {
      id: '9554',
      name: 'Rassie van der Dussen',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '170691',
    },
    {
      id: '13088',
      name: 'Devdutt Padikkal',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '195763',
    },
    {
      id: '9789',
      name: 'Shimron Hetmyer',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '171232',
    },
    {
      id: '13940',
      name: 'Yashasvi Jaiswal',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '226279',
    },
    {
      id: '8271',
      name: 'Sanju Samson',
      captain: true,
      role: 'WK-Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '226289',
    },
    {
      id: '2258',
      name: 'Jos Buttler',
      role: 'WK-Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '170980',
    },
    {
      id: '14691',
      name: 'Dhruv Jurel',
      role: 'WK-Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '226551',
    },
    {
      id: '14049',
      name: 'Anunay Singh',
      role: 'Bowling Allrounder',
      teamName: 'Rajasthan Royals',
      faceImageId: '182026',
    },
    {
      id: '8983',
      name: 'James Neesham',
      role: 'Batting Allrounder',
      teamName: 'Rajasthan Royals',
      faceImageId: '170739',
    },
    {
      id: '10713',
      name: 'Daryl Mitchell',
      role: 'Bowling Allrounder',
      teamName: 'Rajasthan Royals',
      faceImageId: '185494',
    },
    {
      id: '12305',
      name: 'Riyan Parag',
      role: 'Batsman',
      teamName: 'Rajasthan Royals',
      faceImageId: '156160',
    },
    {
      id: '1593',
      name: 'Ravichandran Ashwin',
      role: 'Bowling Allrounder',
      teamName: 'Rajasthan Royals',
      faceImageId: '153372',
    },
    {
      id: '22471',
      name: 'Shubham Garhwal',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '182026',
    },
    {
      id: '13537',
      name: 'Kuldip Yadav',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '182026',
    },
    {
      id: '7774',
      name: 'Nathan Coulter-Nile',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '170648',
    },
    {
      id: '9715',
      name: 'Navdeep Saini',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '226400',
    },
    {
      id: '14336',
      name: 'Kuldeep Sen',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '182026',
    },
    {
      id: '11221',
      name: 'Obed McCoy',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '226303',
    },
    {
      id: '12639',
      name: 'Tejas Baroka',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '182026',
    },
    {
      id: '10353',
      name: 'KC Cariappa',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '226502',
    },
    {
      id: '7910',
      name: 'Yuzvendra Chahal',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '170690',
    },
    {
      id: '10551',
      name: 'Prasidh Krishna',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '167341',
    },
    {
      id: '8117',
      name: 'Trent Boult',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '170747',
    },
    {
      id: '9576',
      name: 'Corbin Bosch',
      role: 'Bowler',
      teamName: 'Rajasthan Royals',
      faceImageId: '157364',
    },
  ]

  const [myTeam1, setMyTeam1] = useState<Array<any>>([])
  const [myTeam2, setMyTeam2] = useState<Array<any>>([])

  return (
    <ModalContent>
      <ModalHeader>
        Select Players
        <Text fontSize="xs">At least 4 from each team and total 11</Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
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
              {players1.map((player: any) => (
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
              ))}
            </TabPanel>
            <TabPanel>
              {players2.map((player: any) => (
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
              ))}
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
