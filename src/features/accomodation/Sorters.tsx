import { Box, styled } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useSearchParams } from "react-router-dom";
import type { SortingValue } from "../../utils/Types";

type TSort = {
  sort_key: Exclude<SortingValue["sort"], null>;
  sort_value: string;
};

const SortersWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  display: "flex",
  justifyContent: "flex-start",
  gap: "25px",
  margin: "4px 0px",
  [theme.breakpoints.down("sm")]: {
    justifyContent: "center",
    gap: "10px",
  },
}));

const Sorter = styled(Box, {
  shouldForwardProp: (prop) => prop !== "isActive",
})<{ isActive: boolean }>(({ theme, isActive }) => ({
  fontSize: "0.8rem",
  fontFamily: "Source Code Pro",
  color: isActive ? theme.palette.primary.main : theme.palette.icons?.main,
  display: "flex",
  alignItems: "center",
  gap: "2px",
  cursor: "pointer",
  userSelect: "none",
}));

export default function Sorters() {
  const [params, setParams] = useSearchParams();
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState<number | null>(null);

  const activeSort = params.get("sortBy");

  const setParamsVal = (sort: SortingValue["sort"], dir: "desc" | "asc") => {
    setParams((params) => {
      params.set("sortBy", sort ?? "");
      params.set("sortDir", dir);
      return params;
    });
  };

  return (
    <SortersWrapper>
      {(t("accommodation.sorters", { returnObjects: true }) as TSort[]).map(
        (sortElement, idx) => {
          return (
            <Sorter
              key={sortElement.sort_key}
              isActive={isActive === idx}
              onClick={() => {
                setIsActive(idx);
                setParamsVal(
                  sortElement.sort_key,
                  params.get("sortDir") === "desc" ? "asc" : "desc",
                );
              }}
              onKeyDown={(e: React.KeyboardEvent) => {
                if (e.key === "Enter") {
                  setIsActive(idx);
                  setParamsVal(
                    sortElement.sort_key,
                    params.get("sortDir") === "desc" ? "asc" : "desc",
                  );
                }
              }}
              tabIndex={0}
            >
              {activeSort === sortElement.sort_key ? (
                params.get("sortDir") === "desc" ? (
                  <KeyboardArrowDownIcon sx={{ fontSize: "0.7rem" }} />
                ) : (
                  <KeyboardArrowUpIcon sx={{ fontSize: "0.7rem" }} />
                )
              ) : (
                <UnfoldMoreIcon sx={{ fontSize: "0.7rem" }} />
              )}
              {sortElement.sort_value}
            </Sorter>
          );
        },
      )}
    </SortersWrapper>
  );
}
