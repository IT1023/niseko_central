import { Container, styled } from "@mui/material";
import Sorters from "../../features/accomodation/Sorters";
import Bookings from "../../features/accomodation/Bookings";
import LinkTitle from "../../components/LinkTitle";
import Title from "../../components/Title";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { useEffect } from "react";
import {
  fetchBookings,
  setFilter,
  setSorter,
  type Filters as TFilter,
} from "../../features/accomodation/bookingsSlice";
import { allowedFilters, allowedSorters } from "../../utils/Constants";
import type { FilterValue, SortingValue } from "../../utils/Types";
import Filters from "../../features/accomodation/Filters";

const ReservationsWrapper = styled(Container)(({ theme }) => ({
  width: "100%",
  height: "100%",
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  gap: "9px",
  padding: "1rem",
  backgroundColor: theme.palette.mainbody?.main,
  [theme.breakpoints.down("md")]: {
    padding: "5px",
    gap: "15px",
  },
}));

export default function Reservations() {
  const [params, _] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const bookings = dispatch(fetchBookings({ checkIn: "", checkOut: "" }));
    const filters = Object.fromEntries(
      Array.from(params.entries()).filter(([k, _v]) =>
        allowedFilters.includes(k as FilterValue["filter"]),
      ),
    ) as unknown as TFilter;
    dispatch(setFilter(filters));
    const sort = (
      allowedSorters.includes(params.get("sortBy") as SortingValue["sort"])
        ? params.get("sortBy")
        : null
    ) as SortingValue["sort"];
    const dir = (
      ["asc", "desc"].includes(params.get("dir") ?? "")
        ? params.get("dir")
        : "desc"
    ) as "desc" | "asc";
    if (!sort) return;
    dispatch(setSorter({ sort, dir }));
    return () => {
      bookings.abort();
    };
  }, [params]);

  return (
    <ReservationsWrapper maxWidth="xl">
      <LinkTitle />
      <Title page={"accommodation"} />
      <Filters />
      <Sorters />
      <Bookings />
    </ReservationsWrapper>
  );
}
