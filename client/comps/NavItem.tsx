import { Flex, FlexProps, Icon } from '@chakra-ui/react'
import { ReactText } from 'react'
import { IconType } from 'react-icons/lib'
import { useRouter } from 'next/router'

interface NavItemProps extends FlexProps {
  icon: IconType
  link: string
  children: ReactText
}
const NavItem = ({ icon, link, children, ...rest }: NavItemProps) => {
  const router = useRouter()
  return (
    <Flex
      align="center"
      p="4"
      mx="4"
      my={4}
      borderRadius="lg"
      role="group"
      cursor="pointer"
      onClick={() => {
        router.push(link)
      }}
      aria-selected={router?.pathname === link}
      _selected={{
        bg: 'green.500',
        color: 'white',
      }}
      _hover={{
        bg: 'green.500',
        color: 'white',
      }}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="20"
          _groupHover={{
            color: 'white',
          }}
          as={icon}
        />
      )}
      {children}
    </Flex>
  )
}

export default NavItem
