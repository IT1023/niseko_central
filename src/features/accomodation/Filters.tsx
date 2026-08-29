import { Box, MenuItem, Select, styled, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectBookingStatus } from "./bookingsSlice";
import type { FilterValue } from "../../utils/Types";
import { useSearchParams } from "react-router-dom";

interface FilterOption {
  label: string;
  placeholder: string;
  key: string;
  options: {
    key: string;
    value: string;
  }[];
}

const FiltersContainer = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  gap: "15px",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const FilterWrapper = styled(Box)({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
});

const Label = styled(InputLabel)({
  textTransform: "capitalize",
  fontFamily: "Inter",
  paddingLeft: "2px",
  fontSize: "0.75rem",
});

const Input = styled(Select)(({ theme }) => ({
  flex: "1",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  borderRadius: "8px",
  backgroundColor: theme.palette.info?.main,
  color: theme.palette.textColor?.main,
}));

const Option = styled(MenuItem)({
  fontSize: "0.85rem",
  fontFamily: "Inter",
  textTransform: "capitalize",
  zIndex: 9999,
});

const Default = styled("span")(({ theme }) => ({
  color: theme.palette.icons?.main,
  fontSize: "0.85rem",
}));

export default function Filters() {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const status = useSelector(selectBookingStatus);
  const isLoading = status === "loading";

  const setParamValue = (key: FilterValue["value"], val: unknown) => {
    setParams((params) => {
      params.set(key, String(val));
      return params;
    });
  };

  const filterData = t("accommodation.filters", {
    returnObjects: true,
  }) as FilterOption[];

  return (
    <FiltersContainer>
      {filterData.map((filter) => {
        return (
          <FilterWrapper key={filter.label}>
            <Label>{filter.label}</Label>
            <Input
              size="small"
              name={filter.key}
              value={params.get(filter.key) || ""}
              displayEmpty
              disabled={isLoading}
              renderValue={(selected: unknown) => {
                if (!selected) {
                  return <Default>{filter.placeholder}</Default>;
                }
                const option = filter.options.find(
                  (opt) => opt.key == selected,
                );
                return option ? option.value : Number(selected);
              }}
              onChange={(e) => setParamValue(filter.key, e.target.value)}
              MenuProps={{
                disableScrollLock: true,
              }}
            >
              {filter.options.map((option) => {
                return (
                  <Option value={option.key} tabIndex={0} key={option.key}>
                    {option.value}
                  </Option>
                );
              })}
            </Input>
          </FilterWrapper>
        );
      })}
    </FiltersContainer>
  );
}
