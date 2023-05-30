import { isBlank } from "./helpers";

test("isBlank", () => {
  expect(true).toEqual(isBlank(""));
});
