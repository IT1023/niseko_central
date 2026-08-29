import { Box, styled } from "@mui/material";
import { useSelector } from "react-redux";
import {
  selectBookingError,
  selectBookingStatus,
  selectDisplayBookings,
} from "./bookingsSlice";
import PropertySkelton from "./PropertySkelton";
import useSkeltonCount from "./useSkeltonCount";
import Card from "../../components/Card";
import { useTranslation } from "react-i18next";
import Empty from "./Empty";

const BookingsWrapper = styled(Box)({
  width: "100%",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
  placeContent: "center",
  placeItems: "center",
  gap: "1rem",
});

export default function Bookings() {
  const { skeltonCount } = useSkeltonCount();
  const { i18n } = useTranslation();
  const status = useSelector(selectBookingStatus);
  const error = useSelector(selectBookingError);
  const displayBookings = useSelector(selectDisplayBookings);

  return (
    <BookingsWrapper>
      {status === "loading" &&
        Array.from({ length: skeltonCount }).map((_, idx) => (
          <PropertySkelton key={idx} />
        ))}
      {status === "failure" && <div>{error}</div>}
      {status === "success" && !displayBookings.length && <Empty />}
      {status === "success" &&
        !!displayBookings.length &&
        displayBookings.map((displayBookings) => {
          const { id, image, blurred_image, max_pax, lifts_distance } =
            displayBookings;
          const langData =
            displayBookings[i18n.language as keyof typeof displayBookings];
          const title =
            typeof langData === "object" && langData !== null
              ? langData.title
              : "";
          const type =
            typeof langData === "object" && langData !== null
              ? langData.type
              : "";
          return (
            <Card
              key={id}
              id={id}
              image={image}
              blurred_image={blurred_image}
              max_pax={max_pax}
              lifts_distance={lifts_distance}
              title={title}
              type={type}
              tag={Math.floor(Math.random() * 3)}
            />
          );
        })}
    </BookingsWrapper>
  );
}
