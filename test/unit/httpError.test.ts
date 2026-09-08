import { describe, expect, it } from "vitest";
import { isNotFoundError } from "../../app/utils/httpError";

describe("isNotFoundError", () => {
  it("is true for a 404 statusCode", () => {
    expect(isNotFoundError({ statusCode: 404 })).toBe(true);
    expect(isNotFoundError({ statusCode: "404" })).toBe(true);
  });

  it("is false for other failures", () => {
    expect(isNotFoundError(null)).toBe(false);
    expect(isNotFoundError(new Error("fail"))).toBe(false);
    expect(isNotFoundError({ statusCode: 500 })).toBe(false);
  });
});
