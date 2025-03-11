import styled from "styled-components";
import BookingDataBox from "../../features/bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import Checkbox from "../../ui/Checkbox";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack";
import { useBooking } from "../bookings/hooks/useBooking";
import Spinner from "../../ui/Spinner";
import { useEffect, useState } from "react";
import { formatCurrency } from "../../utils/helpers";
import { useCheckin } from "./hooks/useCheckin";
import { useSettings } from "../settings/hooks/useSettings";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakFast, setAddBreakFast] = useState(false);
  const moveBack = useMoveBack();
  const { checkin, isCheckingIn } = useCheckin();
  const { booking = {}, isLoading } = useBooking();
  const { settings = {}, isLoading: isLoadingSettings } = useSettings();

  useEffect(() => setConfirmPaid(booking?.isPaid ?? false), [booking])

  const {
    id: bookingId,
    guests,
    totalPrice,
    numGuests,
    hasBreakfast,
    numNights,
  } = booking;
  const optionalBreakFastPrice = settings.breakfastPrice * numNights * numGuests;
  function handleCheckin() {

    if (!confirmPaid) return
    if (addBreakFast) {
      checkin({
        bookingId, breakfast: {
          hasBreakfast: true,
          extraPrice: optionalBreakFastPrice,
          totalPrice: totalPrice + optionalBreakFastPrice
        }
      });
    } else {
      checkin({ bookingId, breakfast: {} });
    }

  }
  if (isLoading || isLoadingSettings) return <Spinner />
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />
      {!hasBreakfast && <Box>
        <Checkbox id="breakfast" checked={addBreakFast}
          onChange={() => {
            setAddBreakFast(add => !add);
            setConfirmPaid(false);
          }}
        > want to add breakfast for {optionalBreakFastPrice}? </Checkbox >
      </Box >}
      <Box>
        <Checkbox id="confirm" checked={confirmPaid} disabled={confirmPaid || isCheckingIn} onChange={() => setConfirmPaid(confirm => !confirm)}> i confirm that {guests.fullName} has paid the total amount {!addBreakFast ? formatCurrency(totalPrice) : `${formatCurrency(totalPrice + optionalBreakFastPrice)}(${formatCurrency(totalPrice)}+ ${formatCurrency(optionalBreakFastPrice)})`}</Checkbox >
      </Box >

      <ButtonGroup>
        <Button disabled={!confirmPaid || isCheckingIn} onClick={handleCheckin}>Check in booking #{bookingId}</Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
