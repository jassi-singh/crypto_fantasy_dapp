import React, { ReactNode, useContext } from 'react'
import {
  Box,
  useColorModeValue,
  Drawer,
  DrawerContent,
  useDisclosure,
  Spacer,
  Flex,
  Modal,
} from '@chakra-ui/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import ConfirmationModal from './ConfirmationModal'

export default function Layout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box
      transition="0.5s ease"
      minH="100vh"
      bg={useColorModeValue('gray.100', 'gray.800')}
    >
      <Sidebar
        onClose={() => onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <Sidebar onClose={onClose} />
        </DrawerContent>
      </Drawer>
      {/* mobilenav */}
      <Flex height={'100vh'} direction="column">
        <Navbar onOpen={onOpen} />
        <Box ml={{ base: 0, md: '64' }} p="4" flexGrow={1} overflow="auto">
          {children}
        </Box>
      </Flex>

      <ConfirmationModal />
    </Box>
  )
}

export const getLayout = (page: any) => <Layout>{page}</Layout>
