import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type {
  FilterValue,
  Reject,
  SortingValue,
  Status,
} from "../../utils/Types";
import z from "zod";
import type Property from "../../pages/item_pages/Property";
import type { RootState } from "../../app/store";

const filtersFunc: Record<
  FilterValue["filter"],
  (d: Property, val: string) => boolean
> = {
  max_pax: (d: Property, val: string) => d.max_pax >= Number(val),
  property: (_d: Property, _val: string) => true,
  type: (_d: Property, _val: string) => true,
};

const sortersFunc: Record<
  Exclude<SortingValue["sort"], null>,
  (d: Property[], dir: SortingValue["dir"]) => Property[]
> = {
  bedrooms: (d: Property[], dir: SortingValue["dir"]) => {
    if (dir === "asc") return d.sort((a, b) => a.beds - b.beds);
    return d.sort((a, b) => b.beds - a.beds);
  },
  discount: (d: Property[], dir: SortingValue["dir"]) => {
    if (dir === "asc") return d.sort((a, b) => a.price - b.price);
    return d.sort((a, b) => b.price - a.price);
  },
  name: (d: Property[], dir: SortingValue["dir"]) => {
    if (dir === "asc")
      return d.sort((a, b) => a.en.title.localeCompare(b.en.title));
    return d.sort((a, b) => b.en.title.localeCompare(a.en.title));
  },
  price: (d: Property[], dir: SortingValue["dir"]) => {
    if (dir === "asc") return d.sort((a, b) => a.price - b.price);
    return d.sort((a, b) => b.price - a.price);
  },
  size: (d: Property[], dir: SortingValue["dir"]) => {
    if (dir === "asc") return d.sort((a, b) => a.size - b.size);
    return d.sort((a, b) => b.size - a.size);
  },
};

const bookingsSchema = z.object({
  properties: z.array(
    z.object({
      id: z.number(),
      image: z.string().nonempty(),
      blurred_image: z.string().nonempty(),
      max_pax: z.number().nonnegative(),
      lifts_distance: z.number(),
      price: z.number(),
      beds: z.number(),
      size: z.number(),
      en: z.object({
        type: z.string(),
        title: z.string(),
      }),
      ja: z.object({
        type: z.string(),
        title: z.string(),
      }),
      fr: z.object({
        type: z.string(),
        title: z.string(),
      }),
      ar: z.object({
        type: z.string(),
        title: z.string(),
      }),
    }),
  ),
});

export type Property = z.infer<typeof bookingsSchema>["properties"][number];

export type Filters = Record<FilterValue["filter"], FilterValue["value"]>;

interface BookingState {
  status: Status;
  error: Reject | null;
  bookings: Property[];
  filters: Filters;
  sorters: SortingValue;
}

const initialState: BookingState = {
  status: "idle",
  error: null,
  bookings: [],
  filters: {
    max_pax: "",
    property: "",
    type: "",
  },
  sorters: {
    sort: null,
    dir: "asc",
  },
};

interface FetchBookingsProps {
  checkIn: string;
  checkOut: string;
}

export const fetchBookings = createAsyncThunk<
  Property[],
  FetchBookingsProps | void,
  { rejectValue: Reject }
>("fetch/bookings", async (args, { rejectWithValue, signal }) => {
  try {
    const { checkIn = "", checkOut = "" } = args || {
      checkIn: "",
      checkOut: "",
    };
    const url: URL = new URL("/api/property", import.meta.env.VITE_API_URL);
    url.searchParams.set("checkIn", checkIn);
    url.searchParams.set("checkOut", checkOut);
    const options: RequestInit = {
      method: "GET",
      signal,
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      if (response.status >= 500) return rejectWithValue("DOWN");
      return rejectWithValue("SYSTEM");
    }
    const data = await response.json();
    const parsed = bookingsSchema.safeParse(data);
    if (!parsed.success) return rejectWithValue("SYSTEM");
    return parsed.data.properties;
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return rejectWithValue("DOWN");
    }
    return rejectWithValue("SYSTEM");
  }
});

export const bookingSlice = createSlice({
  name: "booking/slice",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },
    setSorter: (state, action: PayloadAction<SortingValue>) => {
      const { sort, dir } = action.payload;
      state.sorters.sort = sort;
      state.sorters.dir = dir;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      fetchBookings.rejected,
      (state, action: PayloadAction<Reject | undefined>) => {
        state.status = "failure";
        state.error = action.payload ?? "SYSTEM";
      },
    );
    builder.addCase(
      fetchBookings.fulfilled,
      (state, action: PayloadAction<Property[]>) => {
        state.status = "success";
        state.bookings = action.payload;
      },
    );
  },
});

export const selectBookingStatus = (state: RootState) => state.bookings.status;

export const selectBookingError = (state: RootState) => state.bookings.error;

export const selectBookingFilters = (state: RootState) =>
  state.bookings.filters;

export const selectBookingSorters = (state: RootState) =>
  state.bookings.sorters;

export const selectBookingData = (state: RootState) => state.bookings.bookings;

export const selectDisplayBookings = createSelector(
  [selectBookingData, selectBookingFilters, selectBookingSorters],
  (data, filters, sorters) => {
    if (!data.length) return [];
    const { sort, dir } = sorters;
    const filteredData = data.filter((d) =>
      Object.entries(filters)
        .filter(([_k, v]) => Boolean(v))
        .every(([k, v]) => filtersFunc[k as FilterValue["filter"]](d, v)),
    );
    if (!sort) return filteredData;
    return sortersFunc[sort](filteredData, dir);
  },
);

export default bookingSlice.reducer;
export const { setFilter, setSorter } = bookingSlice.actions;
