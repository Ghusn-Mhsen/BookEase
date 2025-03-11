import styled from "styled-components";
import { useRecentBookings } from "./hooks/useRecentBookings";
import Spinner from "../../ui/Spinner";
import { useRecentStays } from "./hooks/useRecentStay";
import { useCabins } from "../cabins/hooks/useCabins";
import Stats from "./Stats";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;


export default function DashboardLayout() {

  const { isLoading: isLoading_1, bookings } = useRecentBookings();
  const { isLoading: isLoading_2, confirmedStays, numDays } = useRecentStays();
  const { cabins, isLoading: isLoading_3 } = useCabins()
  if (isLoading_1 || isLoading_2 || isLoading_3) return <Spinner />

  return (
    <StyledDashboardLayout>
      <Stats bookings={bookings} confirmedStays={confirmedStays} cabinCount={cabins.length} numDays={numDays} />
      <div>Today&apos;s Activity</div>
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays} />
      <SalesChart bookings={bookings} numDays={numDays} />
      <div>Chart Sales</div>
    </StyledDashboardLayout>
  )
}
