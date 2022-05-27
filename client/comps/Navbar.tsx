import {
  Box,
  Button,
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
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiMenu, FiMoon, FiSun } from 'react-icons/fi'
import { MdSportsCricket } from 'react-icons/md'
import Jazzicon from 'react-jazzicon'
import { getChain, useMoralis } from 'react-moralis'

interface NavbarProps extends FlexProps {
  onOpen: () => void
}
const chainImage = (chainId: any) => {
  switch (chainId) {
    case '0x4':
      return 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022'
    case '0x61':
      return 'https://cryptologos.cc/logos/bnb-bnb-logo.png?v=022'
    case '0x13881':
      return 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=022'
    case '0x89':
      return 'https://cryptologos.cc/logos/polygon-matic-logo.png?v=022'
    default:
      return 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022'
  }
}
const Navbar = ({ onOpen, ...rest }: NavbarProps) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const router = useRouter()
  const [title, setTitle] = useState('Explore')
  const { enableWeb3, deactivateWeb3, isWeb3Enabled, web3, account, chainId } =
    useMoralis()

  useEffect(() => {
    switch (router.pathname) {
      case '/myContests':
        setTitle('My Contests')
        break
      case '/stats':
        setTitle('Stats')
        break
      case '/pointsSystem':
        setTitle('Fantasy Points System')
        break
      default:
        setTitle('Explore')
        break
    }
  }, [router?.pathname])

  const connectWallet = async () => {
    await enableWeb3({ provider: 'metamask' })
  }

  const disconnectWallet = async () => {
    await deactivateWeb3()
  }

  return (
    <Flex
      transition="0.5s ease"
      ml={{ base: 0, md: '64' }}
      px={{ base: 4, md: 4 }}
      py={4}
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
        <Icon fontSize={20} color="purple.500" as={MdSportsCricket} mx="5" />
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="purple.500"
        >
          Real Sports
        </Text>
      </Box>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="toggle color mode"
          icon={colorMode == 'light' ? <FiMoon /> : <FiSun />}
          onClick={toggleColorMode}
        />
        <Button
          display={isWeb3Enabled ? 'flex' : 'none'}
          leftIcon={<img src={chainImage(chainId)} width={20} />}
        >
          {getChain(chainId ?? '')?.nativeCurrency.name}
        </Button>

        <Flex alignItems={'center'}>
          {isWeb3Enabled ? (
            <Menu>
              <MenuButton
                py={2}
                transition="all 0.3s"
                _focus={{ boxShadow: 'none' }}
              >
                <HStack>
                  <Jazzicon diameter={35} seed={parseInt(account?.substring(0,16) ?? '', 16)} />
                  <VStack
                    display={{ base: 'none', md: 'flex' }}
                    alignItems="flex-start"
                    spacing="1px"
                    ml="2"
                  >
                    <Text fontSize="sm">
                      {account?.substring(0, 5)}...{account?.substring(38)}
                    </Text>
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
                <MenuItem onClick={disconnectWallet}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button colorScheme="purple" onClick={connectWallet}>
              Connect Wallet
            </Button>
          )}
        </Flex>
      </HStack>
    </Flex>
  )
}
export default Navbar
