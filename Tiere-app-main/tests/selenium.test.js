import { Builder, By, until } from "selenium-webdriver";

let driver;

beforeAll(async () => {
  driver = await new Builder().forBrowser("chrome").build();
  await driver.get("http://localhost:3001");
});

afterAll(async () => {
  await driver.quit();
});

test('tier hinzufügen und in der Liste verifizieren', async () => {
  await driver.findElement(By.linkText("Tiere Hinzufügen")).click();
  await driver.findElement(By.name("tierart")).sendKeys("Esel");
  await driver.findElement(By.name("name")).sendKeys("IA");
  await driver.findElement(By.name("krankheit")).sendKeys("Bauchweh");
  await driver.findElement(By.name("geburtstag")).sendKeys("01.05.2022");
  await driver.findElement(By.name("gewicht")).sendKeys("120");
  await driver.findElement(By.css("button")).click();
  await driver.wait(until.alertIsPresent(), 2000);
  let alert = await driver.switchTo().alert();
  await alert.accept();

  const allTiereLink = await driver.wait(until.elementLocated(By.linkText("Alle Tiere anzeigen")), 2000);
  allTiereLink.click();

  await driver.wait(until.elementLocated(By.css("ul")), 2000);
  const lastChild = await driver.findElement(By.css("ul li:last-child"));
  expect(await lastChild.getText()).toContain("IA");
});

test("tier editieren und in der Liste verifizieren", async () => {
  await driver.findElement(By.linkText("Alle Tiere anzeigen")).click();
  await driver.wait(until.elementLocated(By.css("ul")), 2000);
  const editLink = await driver.findElement(By.xpath("//li[contains(text(), 'IA')]/a[text()='Bearbeiten']"));
  await editLink.click();
  await driver.wait(until.elementLocated(By.name("name")), 2000);
  const nameField = await driver.findElement(By.name("name"));
  await nameField.clear();
  await nameField.sendKeys("IA Bearbeitet");
  const krankheitField = await driver.findElement(By.name("krankheit"));
  await krankheitField.clear();
  await krankheitField.sendKeys("Kopfweh");
  await driver.findElement(By.css("button")).click();
  await driver.wait(until.alertIsPresent(), 2000);
  let alert = await driver.switchTo().alert();
  await alert.accept();
  const allTiereLink = await driver.wait(until.elementLocated(By.linkText("Alle Tiere anzeigen")), 2000);
  allTiereLink.click();
  await driver.wait(until.elementLocated(By.css("ul")), 2000);
  const lastChild = await driver.findElement(By.css("ul li:last-child"));
  expect(await lastChild.getText()).toContain("IA Bearbeitet");
});
