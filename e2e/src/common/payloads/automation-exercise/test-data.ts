import { faker } from "@faker-js/faker";
import { AutomationUser } from "../../models/automation-exercise/types";

export class TestData {
  private static createCommonFields(): AutomationUser {
    const suffix = faker.number.int({ min: 100000, max: 999999 });
    const firstname = faker.person.firstName();
    const lastname = faker.person.lastName();
    const name = `${firstname} ${lastname}`;
    const normalizedFirst = firstname.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normalizedLast = lastname.toLowerCase().replace(/[^a-z0-9]/g, "");
    const birthYear = faker.number.int({ min: 1970, max: 2005 });
    const birthMonth = faker.number.int({ min: 1, max: 12 });
    const birthDay = faker.number.int({ min: 1, max: 28 });
    const mobileNumber = faker.number.int({ min: 1000000000, max: 9999999999 });
    const zipcode = Number(faker.location.zipCode("#####"));
    return {
      name,
      email: `${normalizedFirst}.${normalizedLast}.${suffix}@example.com`,
      password: "P@ssw0rd123!",
      title: faker.helpers.arrayElement(["Mr", "Mrs"]),
      birth_date: birthDay,
      birth_month: birthMonth,
      birth_year: birthYear,
      firstname,
      lastname,
      address1: faker.location.streetAddress(),
      country: faker.helpers.arrayElement([
        "India",
        "United States",
        "Canada",
        "Australia",
        "Israel",
        "New Zealand",
        "Signapore",
      ]),
      city: faker.location.city(),
      zipcode,
      state: faker.location.state(),
      mobile_number: mobileNumber,
    };
  }

  private static createOptionalFields(): Partial<AutomationUser> {
    return {
      company: faker.company.name(),
      address2: faker.number.int({ min: 1, max: 999 }).toString(),
    };
  }

  static createMinimalFakeUser(): AutomationUser {
    return TestData.createCommonFields();
  }

  static createFullFakeUser(): AutomationUser {
    return {
      ...TestData.createMinimalFakeUser(),
      ...TestData.createOptionalFields(),
    };
  }
}
