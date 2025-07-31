// trainer/programs/[id]/page.type.ts
export type PageParams = {
  id: string;
};

export type PageProps = {
  params: PageParams;
  searchParams?: Record<string, string | string[] | undefined>;
};