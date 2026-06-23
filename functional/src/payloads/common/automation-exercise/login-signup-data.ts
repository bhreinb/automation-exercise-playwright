import { faker } from "@faker-js/faker";
import { AutomationUser } from "@models/common/automation-exercise/login.types";

export class LoginSignupData {
  private static createPassword(): string {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const digits = "0123456789";
    const special = "!@#$%^&*()-_=+[]{};:,.<>?";
    const pick = (chars: string) => faker.helpers.arrayElement(chars.split(""));
    const length = faker.number.int({ min: 12, max: 16 });
    // Ensure we always have at least one char from each category.
    const passwordChars = [
      pick(lowercase),
      pick(uppercase),
      pick(digits),
      pick(special),
    ];
    const all = lowercase + uppercase + digits + special;
    while (passwordChars.length < length) {
      passwordChars.push(pick(all));
    }
    return faker.helpers.shuffle(passwordChars).join("");
  }

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
      password: LoginSignupData.createPassword(),
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
    return LoginSignupData.createCommonFields();
  }

  static createFullFakeUser(): AutomationUser {
    return {
      ...LoginSignupData.createMinimalFakeUser(),
      ...LoginSignupData.createOptionalFields(),
    };
  }
}
