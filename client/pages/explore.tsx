import {
  Button,
  Center,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import axios from 'axios'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import useSWR from 'swr'
import MatchCard from '../comps/MatchCard'
import { contractProvider } from '../contextApi/contractProvider'

const explore = () => {
  const matchTypes: Array<string> = [
    'International',
    'League',
    'Domestic',
    'Women',
  ]
  const [selectedMatchType, setSelectedMatchType] = useState(matchTypes[0])
  const { live, upcoming, past, liveError, upcomingError, pastError }: any =
    useContext(contractProvider)
  if (upcomingError || liveError || pastError)
    return <Center>failed to load</Center>

  if (!upcoming || !live || !past) return <Center>loading...</Center>
  return (
    <>
      <Tabs variant="soft-rounded" colorScheme="purple">
        <TabList justifyContent="space-between">
          <HStack>
            <Tab>Upcoming</Tab>
            <Tab>Live</Tab>
            <Tab>Past</Tab>
          </HStack>
          <Menu>
            <MenuButton
              borderWidth="medium"
              as={Button}
              rightIcon={<FiChevronDown />}
            >
              {selectedMatchType}
            </MenuButton>
            <MenuList>
              {matchTypes.map((type: string) => (
                <MenuItem
                  key={type}
                  onClick={() => {
                    setSelectedMatchType(type)
                  }}
                >
                  {type}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </TabList>
        <TabPanels>
          <TabPanel>
            {upcoming?.typeMatches[
              matchTypes.indexOf(selectedMatchType)
            ]?.seriesAdWrapper?.map((item: any) =>
              item?.seriesMatches?.matches?.map((allMatch: any) => (
                <MatchCard
                  key={allMatch?.matchInfo?.matchId}
                  matchData={allMatch?.matchInfo}
                />
              ))
            )}
          </TabPanel>
          <TabPanel>
            {live?.typeMatches[
              matchTypes.indexOf(selectedMatchType)
            ]?.seriesAdWrapper?.map((item: any) =>
              item?.seriesMatches?.matches?.map((allMatch: any) => (
                <MatchCard
                  key={allMatch?.matchInfo?.matchId}
                  matchData={allMatch?.matchInfo}
                />
              ))
            )}
          </TabPanel>
          <TabPanel>
            {past?.typeMatches[
              matchTypes.indexOf(selectedMatchType)
            ]?.seriesAdWrapper?.map((item: any) =>
              item?.seriesMatches?.matches?.map((allMatch: any) => (
                <MatchCard
                  key={allMatch?.matchInfo?.matchId}
                  matchData={allMatch?.matchInfo}
                />
              ))
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}
export default explore
