import {
  Box,
  Center,
  Divider,
  HStack,
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react'
import React from 'react'

const pointsSystem = () => {
  return (
    <Center>
      <Box
        w="lg"
        shadow="lg"
        borderRadius="lg"
        m="4"
        p="4"
        bg={useColorModeValue('white', 'gray.900')}
      >
        <Tabs isFitted variant="enclosed">
          <TabList mb="1em">
            <Tab>Batting</Tab>
            <Tab>Bowling</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <TableContainer justifyContent={'center'}>
                <Table size={'lg'} variant="striped" colorScheme="purple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th isNumeric>Points</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Each Run</Td>
                      <Td isNumeric>+1</Td>
                    </Tr>
                    <Tr>
                      <Td>Fours</Td>
                      <Td isNumeric>+1</Td>
                    </Tr>
                    <Tr>
                      <Td>Sixes</Td>
                      <Td isNumeric>+2</Td>
                    </Tr>
                    <Tr>
                      <Td>Dismissal for 0 run</Td>
                      <Td isNumeric>-2</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
            <TabPanel>
              <TableContainer justifyContent={'center'}>
                <Table size={'lg'} variant="striped" colorScheme="purple">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th isNumeric>Points</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Each Wicket</Td>
                      <Td isNumeric>+25</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Center>
  )
}

export default pointsSystem
