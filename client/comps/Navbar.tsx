import {
  Avatar,
  Box,
  Flex,
  FlexProps,
  Heading,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useColorMode,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { MdSportsCricket } from 'react-icons/md'
import Jazzicon from 'react-jazzicon'

interface NavbarProps extends FlexProps {
  onOpen: () => void
}
const Navbar = ({ onOpen, ...rest }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const [title, setTitle] = useState('Upcoming Matches')

  useEffect(() => {
    switch (router.pathname) {
      case '/liveScores':
        setTitle('Live Scores')
        break
      case '/myContests':
        setTitle('My Contests')
        break
      case '/stats':
        setTitle('Stats')
        break
      case '/howToPlay':
        setTitle('How To Play')
        break
      default:
        setTitle('Upcoming Matches')
        break
    }
  }, [router?.pathname])

  return (
    <Flex
      transition="0.5s ease"
      ml={{ base: 0, md: '64' }}
      px={{ base: 4, md: 4 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue('white', 'gray.900')}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
      justifyContent={{ base: 'space-between' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />
      <Heading
        display={{ base: 'none', md: 'flex' }}
        justifySelf="self-start"
        size="md"
      >
        {title}
      </Heading>

      <Box display={{ base: 'flex', md: 'none' }} alignItems="center">
        <Icon fontSize={20} color="green.500" as={MdSportsCricket} mx="5" />
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="green.500"
        >
          Real Sports
        </Text>
      </Box>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="open menu"
          icon={colorMode == 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
        />
        <Flex alignItems={'center'}>
          <Menu>
            <MenuButton
              py={2}
              transition="all 0.3s"
              _focus={{ boxShadow: 'none' }}
            >
              <HStack>
                <Jazzicon diameter={35} seed={parseInt('4B890C1f05F411', 16)} />
                <VStack
                  display={{ base: 'none', md: 'flex' }}
                  alignItems="flex-start"
                  spacing="1px"
                  ml="2"
                >
                  <Text fontSize="sm">Justina Clark</Text>
                </VStack>
                <Box display={{ base: 'none', md: 'flex' }}>
                  <FiChevronDown />
                </Box>
              </HStack>
            </MenuButton>
            <MenuList
              bg={useColorModeValue('white', 'gray.900')}
              borderColor={useColorModeValue('gray.200', 'gray.700')}
            >
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Billing</MenuItem>
              <MenuDivider />
              <MenuItem>Sign out</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </HStack>
    </Flex>
  )
}
export default Navbar
