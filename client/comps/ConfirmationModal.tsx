import React, { useContext } from 'react'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  Text,
  ModalHeader,
  Center,
  Spinner,
  ModalFooter,
  Button,
  Flex,
  HStack,
  Icon,
  Divider,
  Link,
} from '@chakra-ui/react'
import { contractProvider } from '../contextApi/contractProvider'
import { AiFillCheckCircle } from 'react-icons/ai'
import { getChain, useMoralis } from 'react-moralis'

const ConfirmationModal = () => {
  const { isTransactionPending, onStatusModalClose, transaction }: any =
    useContext(contractProvider)
  const { chainId } = useMoralis()
  console.log(transaction)
  return (
    <Modal
      isOpen={isTransactionPending}
      onClose={onStatusModalClose}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transaction Status</ModalHeader>
        <Divider />
        <ModalBody>
          <Flex m="10" justifyContent={'center'}>
            {transaction?.confirmations ? (
              <Icon
                fontSize="xxx-large"
                color="green.500"
                as={AiFillCheckCircle}
              />
            ) : (
              <Spinner
                thickness="4px"
                speed="0.75s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            )}
          </Flex>
          <HStack alignItems="start" justifyContent="space-between">
            <Text mr="5" fontWeight="bold">
              Transaction Hash :
            </Text>
            <Link
            outline='none'
              href={`${getChain(chainId ?? '')?.blockExplorerUrl}/tx/${
                transaction?.hash ?? transaction?.transactionHash
              }`}
              isExternal
              overflowWrap="anywhere"
            >
              {transaction?.hash ?? transaction?.transactionHash}
            </Link>
          </HStack>
        </ModalBody>
        <ModalFooter>
          {transaction?.confirmations != 0 && (
            <Button colorScheme="purple" mr={3} onClick={onStatusModalClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ConfirmationModal
