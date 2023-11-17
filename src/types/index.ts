export interface IHomeProps {
  params: { [key: string]: string | string[] | undefined };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export interface IEmployee {
  name: string;
  position: string;
  salary: number;
  department: string;
}
