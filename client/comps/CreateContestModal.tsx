import {
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Text,
  useNumberInput,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import Moralis from 'moralis'
import React, { useContext } from 'react'
import { getChain, useMoralis } from 'react-moralis'
import { contractProvider } from '../contextApi/contractProvider'

const CreateContestModal = ({ matchData, onClose }: any) => {
  const { createContest, isLoading }: any = useContext(contractProvider)
  const [value, setValue] = React.useState(0.01)
  const handleChange = (event: any) => setValue(event.target.value)
  const { chainId } = useMoralis()
  const { getInputProps } = useNumberInput({
    defaultValue: 0.01,
    min: 0.01,
    precision: 4,
  })
  const input = getInputProps()
  return (
    <ModalContent>
      <ModalHeader>Entry Fee for the Contest</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InputGroup>
          <Input onChange={handleChange} value={value} {...input} />
          <InputRightAddon
            children={getChain(chainId ?? '')?.nativeCurrency.symbol}
          />
        </InputGroup>
      </ModalBody>
      <ModalFooter>
        <Button
          colorScheme="purple"
          mr={3}
          onClick={() => {
            console.log(
              DateTime.fromMillis(
                parseInt(matchData?.startDate)
              ).toUnixInteger()
            )
            const params = {
              matchId: matchData?.matchId.toString(),
              fee: Moralis.Units.Token(
                value,
                getChain(chainId ?? '0x1')?.nativeCurrency.decimals
              ),
              startDateTime: DateTime.now().toUnixInteger(),
              endDateTime: DateTime.fromMillis(
                parseInt(matchData?.endDate)
              ).toUnixInteger(),
              joinDeadline: DateTime.fromMillis(
                parseInt(matchData?.startDate)
              ).toUnixInteger(),
            }
            console.log(params)
            createContest(params)
            onClose()
          }}
          disabled={isLoading}
        >
          Create
        </Button>
      </ModalFooter>
    </ModalContent>
  )
}

export default CreateContestModal
