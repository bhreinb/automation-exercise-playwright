import {
  test,
  expect,
} from "../../../src/common/fixtures/automation-exercise/integration.fixtures";
import { TestData } from "../../../src/common/payloads/automation-exercise/test-data";
import { AutomationUser } from "../../../src/common/models/automation-exercise/types";

test.describe("Login Page Tests", () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test("Test Case 1: Register User", {tag: '@regression'}, async ({
    loginPage,
    signupPage,
    accountCreatedPage,
  }, testInfo) => {
    //Given...
    const fakeUser: AutomationUser = TestData.createFullFakeUser();
    console.log(`[${testInfo.title}] fakeUser`, JSON.stringify(fakeUser));

    //When...
    await loginPage.setName(fakeUser.name);
    await loginPage.setEmail(fakeUser.email);
    await loginPage.submitSignup();
    await expect(signupPage.name).toHaveValue(fakeUser.name);
    await expect(signupPage.email).toHaveValue(fakeUser.email);
    await signupPage.pageLoaded();
    await signupPage.setTitle(fakeUser.title);
    await signupPage.setPassword(fakeUser.password);
    await signupPage.setDay(fakeUser.birth_date);
    await signupPage.setMonth(fakeUser.birth_month);
    await signupPage.setYear(fakeUser.birth_year);
    await signupPage.setFirstName(fakeUser.firstname);
    await signupPage.setLastName(fakeUser.lastname);
    await signupPage.setCompany(fakeUser.company);
    await signupPage.setAddress(fakeUser.address1);
    await signupPage.setAddress2(fakeUser.address2);
    await signupPage.setCountry(fakeUser.country);
    await signupPage.setState(fakeUser.state);
    await signupPage.setCity(fakeUser.city);
    await signupPage.setZipcode(fakeUser.zipcode);
    await signupPage.setMobileNumber(fakeUser.mobile_number);
    await signupPage.submitCreateAccount();

    //Then...
    await accountCreatedPage.pageLoaded();
    await expect(accountCreatedPage.congratulationsMessage).toHaveText(
      "Congratulations! Your new account has been successfully created!",
    );
  });

  test.describe("Shared workflow for Tests 2 & 3 & 4", () => {
    let fakeUser: AutomationUser;

    test.beforeEach(async ({ createAccountMethods }, testInfo) => {
      //Given...
      fakeUser = TestData.createFullFakeUser();
      console.log(`[${testInfo.title}] fakeUser`, JSON.stringify(fakeUser));

      const createAccountsResponse =
        await createAccountMethods.postToCreateAccount(fakeUser);
      const response = await createAccountsResponse.json();
      expect(response.responseCode).toEqual(201);
      expect(response.message).toEqual("User created!");
    });

    test.describe("Shared workflow for Tests 2 & 4 (Logged in)", () => {
      test.beforeEach(async ({ loginPage }) => {
        //When (login)
        await loginPage.setRegisteredEmail(fakeUser.email);
        await loginPage.setPassword(fakeUser.password);
        await loginPage.submitLogin();
      });

      test("Test Case 2: Login User with correct email and password", {tag: ['@regression', '@smoke']}, async ({
        loginPage,
      }, testInfo) => {
        //Then...
        const currentUrl = await (loginPage as any).page.url();
        const baseUrl = (testInfo.project as any).use?.baseURL ?? "";
        expect(currentUrl.replace(/\/$/, "")).toBe(
          String(baseUrl).replace(/\/$/, ""),
        );
        expect(await loginPage.isLogoutLinkVisible()).toBe(true);
        const loggedInUser = await loginPage.getLoggedInUser();
        expect(loggedInUser).toBe(fakeUser.name);
      });

      test("Test Case 4: Logout User", {tag: '@regression'}, async ({ loginPage }) => {
        //When...
        await loginPage.logoutLink.click();

        //Then...
        await loginPage.pageLoaded();
        expect(await loginPage.isLogoutLinkVisible()).toBe(false);
      });
    });

    test("Test Case 3: Login User with incorrect email and password", {tag: '@regression'}, async ({
      loginPage,
    }) => {
      //When...
      await loginPage.setRegisteredEmail(fakeUser.email);
      await loginPage.setPassword("wrongPassword");
      await loginPage.submitLogin();

      //Then...
      expect(await loginPage.isLoginErrorVisible()).toBe(true);
    });
  });
});
