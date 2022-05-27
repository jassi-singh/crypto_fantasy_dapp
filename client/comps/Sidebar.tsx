import {
  Box,
  BoxProps,
  CloseButton,
  Flex,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { IconType } from 'react-icons'
import { FiCompass } from 'react-icons/fi'
import { CgMediaLive } from 'react-icons/cg'
import { BiStats, BiQuestionMark, BiCalculator } from 'react-icons/bi'
import { GiRunningNinja } from 'react-icons/gi'
import { MdSportsCricket } from 'react-icons/md'
import NavItem from './NavItem'

interface SidebarProps extends BoxProps {
  onClose: () => void
}

interface LinkItemProps {
  name: string
  icon: IconType
  link: string
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Explore', icon: FiCompass, link: '/explore' },
  // { name: 'My Contests', icon: GiRunningNinja, link: '/myContests' },
  // { name: 'Stats', icon: BiStats, link: '/stats' },
  { name: 'Points System', icon: BiCalculator, link: '/pointsSystem' },
]

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="0.5s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: '64' }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Icon fontSize={20} color="purple.500" as={MdSportsCricket} />
        <Text
          fontSize="2xl"
          fontFamily="monospace"
          fontWeight="bold"
          color="purple.500"
        >
          Real Sports
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} link={link.link}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  )
}

export default Sidebar
