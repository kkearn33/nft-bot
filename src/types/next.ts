import { ReactNode } from "react";

export type PageSearchParam = string | string[] | undefined;
export type PageParams<T extends Record<string, string> = Record<string, string>> = Promise<T>;
export type PageSearchParams<T extends Record<string, PageSearchParam> = Record<string, PageSearchParam>> = Promise<T>;
export type PageProps<
  T extends Record<string, string> = Record<string, string>,
  U extends Record<string, PageSearchParam> = Record<string, PageSearchParam>
> = {
  params: PageParams<T>,
  searchParams: PageSearchParams<U>
}
export type PropsWithChildren<T = object> = Readonly<T & { className?: string, children?: ReactNode }>;

