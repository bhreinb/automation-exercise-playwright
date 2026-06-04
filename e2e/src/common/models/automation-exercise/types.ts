export type AutomationUser = {
  name: string;
  email: string;
  password: string;
  title: "Mr" | "Mrs";
  birth_date: number;
  birth_month: number;
  birth_year: number;
  firstname: string;
  lastname: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  city: string;
  zipcode: number;
  state: string;
  mobile_number: number;
};
