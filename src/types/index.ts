export interface IHomeProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export interface IPagination {
  page?: string;
  totalPages: number;
};

export interface IEmployee {
  id: number,
  name: string;
  position: string;
  salary: number;
  department: string;
}
