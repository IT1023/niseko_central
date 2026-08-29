import type { TLanguage } from "../features/languages/changeLanguage";
import type { FilterValue, SortingValue, TBackendErrors } from "./Types";

export const debouncer = <T extends (...args: unknown[]) => void>(
  callback: T,
  cooldown: number,
) => {
  let timer: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      callback.call(null, args);
    }, cooldown);
  };
};
export const possibleLanguages = ["en", "ja", "ar", "fr"];
export const backendErrors: TBackendErrors = {
  en: {
    "400": "Please refresh the page or return to the homepage",
    "401":
      "You are not authorized to access this page, please return to the homepage",
    "403":
      "You do not have permission to access this page; please contact the administration or return to the homepage",
    "404": "The requested resource cannot be found",
    "405": "The requested resource cannot be accessed with this HTTP method",
    "500": "Internal server error; please try again later",
    "522": "Server under maintenance; service will resume shortly",
  },
  ja: {
    "400": "ページを更新するか、ホームページに戻ってください",
    "401":
      "このページにアクセスする権限がありません。ホームページに戻ってください",
    "403":
      "このページにアクセスする権限がありません。管理者に連絡するか、ホームページに戻ってください",
    "404": "要求されたリソースが見つかりません",
    "405": "このリソースは、このHTTPメソッドではアクセスできません",
    "500":
      "サーバー内部でエラーが発生しました。しばらくしてから再度お試しください",
    "522": "サーバーはメンテナンス中です。まもなく復旧します",
  },
  ar: {
    "400": "يرجى تحديث الصفحة أو العودة إلى الصفحة الرئيسية",
    "401":
      "ليس لديك إذن للوصول إلى هذه الصفحة؛ يرجى العودة إلى الصفحة الرئيسية",
    "403":
      "ليس لديك صلاحية الوصول إلى هذه الصفحة؛ يرجى الاتصال بالإدارة أو العودة إلى الصفحة الرئيسية",
    "404": "المورد المطلوب غير موجود",
    "405": "لا يمكن الوصول إلى المورد المطلوب باستخدام طريقة هذه",
    "500": "خطأ داخلي في الخادم؛ يرجى المحاولة لاحقًا",
    "522": "الخادم تحت الصيانة؛ سيعود للعمل قريبًا",
  },
  fr: {
    "400": "Veuillez actualiser la page ou revenir à la page d'accueil",
    "401":
      "Vous n'êtes pas autorisé à accéder à cette page ; veuillez revenir à la page d'accueil",
    "403":
      "Vous n'avez pas la permission d'accéder à cette page ; veuillez contacter l'administration ou revenir à la page d'accueil",
    "404": "La ressource demandée est introuvable",
    "405":
      "La ressource demandée ne peut pas être accédée avec cette méthode HTTP",
    "500": "Erreur interne du serveur ; veuillez réessayer plus tard",
    "522": "Serveur en maintenance ; le service reprendra sous peu",
  },
};

export const convertDate = (d: Date, lang: TLanguage) => {
  return d.toLocaleDateString(lang, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

export const swiperSlideCount = (basis: number): number => {
  if (basis < 750) return 1;
  return Math.min(Math.floor(basis / 650) + 1, 3);
};

export const RenderAnimationStyle = (
  direction: "top" | "right" | "bottom" | "left",
  offset: number,
) => {
  const axis = direction === "top" || direction === "bottom" ? "y" : "x";
  const charge = direction === "top" || direction === "left" ? "+" : "-";
  return {
    initial: {
      [axis]: Number(`${charge}${offset}`),
    },
    animate: {
      [axis]: 0,
    },
  };
};

export const sanitizeURL = (url: string): string => {
  if (!url || typeof url !== "string") return "";
  const sanitizedURL = encodeURIComponent(
    url
      .toLowerCase()
      .split(/\s+/)
      .filter((elem) => elem !== "-")
      .join("-"),
  );
  return sanitizedURL;
};

export const niceUrl = (url: string): string => {
  const modURL = url
    .split("-")
    .map((word) =>
      word
        .split("")
        .map((a, idx) => (idx === 0 ? a.toUpperCase() : a))
        .join(""),
    )
    .join(" ");
  return decodeURIComponent(modURL);
};

export const accessibility_language_map = {
  en: "English",
  fr: "Français",
  ja: "日本語",
  ar: "العربية",
};

export const formatLinkUrl = (linkURL: string): string[] => {
  return linkURL
    .split("/")
    .slice(1)
    .map((link) => link.replaceAll(/[^a-zA-Z0-9]+/g, " "));
};

export const tags = {
  en: ["Vehicle Included", "Shutter Included"],
  ar: ["المركبة متضمنة", "الغالق متضمن"],
  ja: ["車両付属", "シャッター付属"],
  fr: ["Véhicule inclus", "Volet inclus"],
};

export const subTag = {
  en: "Winter Only",
  ar: "الشتاء فقط",
  fr: "Hiver seulement",
  ja: "冬季限定",
};

export const properties_types: Map<number, string> = new Map([
  [0, ""],
  [40, "Deep Tracks"],
  [41, "Ezo 365"],
  [38, "Hirafu House"],
  [37, "Horizon Townhouses"],
  [12709, "Hirafu Woods"],
  [36, "J House"],
  [35, "Kashi Lodge"],
  [33, "Kisetsukan"],
  [32, "Konkuriito"],
  [31, "Miharashi"],
  [30, "Miyuki"],
  [29, "Mori Houses"],
  [28, "Powder Tracks"],
  [27, "Sekka Kan"],
  [26, "Shirakaba"],
  [9463, "Tsuru"],
  [21, "Whiskey Woods"],
  [42, "Yama Shizen"],
  [24, "Youtei Tracks"],
]);

export const format_date = (date: Date, locale: TLanguage) => {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const generate_page_count = (
  current_page: number,
  last_page: number,
) => {
  const control_first_page = Math.max(1, current_page - 2);
  const control_last_page = Math.min(Math.max(current_page + 2, 5), last_page);

  const length = Math.min(5, last_page);

  const pages_count = Array.from({ length }, (_, idx) =>
    control_first_page + length - 1 <= control_last_page
      ? control_first_page + idx
      : control_last_page - length + 1 + idx,
  );

  return pages_count;
};

export const allowedFilters: FilterValue["filter"][] = [
  "max_pax",
  "property",
  "type",
];
export const allowedSorters: SortingValue["sort"][] = [
  "bedrooms",
  "discount",
  "name",
  "price",
  "size",
];
