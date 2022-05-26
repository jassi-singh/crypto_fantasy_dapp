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
  Heading,
} from '@chakra-ui/react'
import { contractProvider, Status } from '../contextApi/contractProvider'
import { AiFillCheckCircle, AiFillCloseCircle } from 'react-icons/ai'
import { getChain, useMoralis } from 'react-moralis'

const ConfirmationModal = () => {
  const { isTransactionPending, onStatusModalClose, transaction }: any =
    useContext(contractProvider)
  const { chainId } = useMoralis()
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
            {transaction?.status === Status.pending ? (
              <Spinner
                thickness="4px"
                speed="0.75s"
                emptyColor="gray.200"
                color="purple.500"
                size="xl"
              />
            ) : (
              <Icon
                fontSize="xxx-large"
                color={
                  transaction?.status === Status.success
                    ? 'green.500'
                    : 'red.500'
                }
                as={
                  transaction?.status === Status.success
                    ? AiFillCheckCircle
                    : AiFillCloseCircle
                }
              />
            )}
          </Flex>
          <Heading m="4" fontSize="md" textAlign="center">
            {transaction?.title}
          </Heading>
          <HStack alignItems="start" justifyContent="space-between">
            <Text mr="5" fontWeight="bold">
              Transaction Hash :
            </Text>
            <Link
              outline="none"
              href={`${getChain(chainId ?? '')?.blockExplorerUrl}/tx/${
                transaction?.data?.hash ?? transaction?.data?.transactionHash
              }`}
              isExternal
              overflowWrap="anywhere"
            >
              {transaction?.data?.hash ?? transaction?.data?.transactionHash}
            </Link>
          </HStack>
        </ModalBody>
        <ModalFooter>
          {transaction?.status != Status.pending && (
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
