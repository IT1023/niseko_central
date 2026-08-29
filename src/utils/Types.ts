import type { possibleLanguages } from "./Constants";

export type TTheme = "light" | "dark";
export type TRoutes = {
  path: string;
  element: React.FC;
};
export type TRoles = "admin" | "devs" | "member" | "guest";
export type TCurrentUser = {
  id: number;
  permissions: TRoles;
  name: string;
};
export type THTTPCodes = "400" | "401" | "403" | "404" | "405" | "500" | "522";
export type TBackendErrors = Record<
  (typeof possibleLanguages)[number],
  Record<THTTPCodes, string>
>;
export type MobileMenuItemType = {
  path: string;
  element: string;
  children?: MobileMenuItemType[];
};

export type THeroContent = {
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  more: string;
  link: string;
  blur_image: string;
};

export type ServiceContents = {
  title: string;
  body: string;
};

export type FilterValue = {
  filter: "type" | "max_pax" | "property";
  value: string;
};

export type SortingValue = {
  sort: "price" | "name" | "size" | "discount" | "bedrooms" | null;
  dir: "asc" | "desc";
};

export type Status = "idle" | "loading" | "failure" | "success";

export type Reject = "ABORT" | "DOWN" | "SYSTEM";
