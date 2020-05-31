import { DefaultNumberOfSaltRounds,encrypt, genSalt, hash } from "./crypto";
import assert from "assert";
import bcrypt from "bcrypt";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    genSalt: jest.fn(),
    hash: jest.fn(),
  },
}));

describe("server/crypto", () => {
  test("genSalt", async () => {
    bcrypt.genSalt.mockResolvedValue("expectedSalt");
    let actualSalt = await genSalt();
    assert.equal(actualSalt, "expectedSalt");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(DefaultNumberOfSaltRounds);

    actualSalt = await genSalt(22);
    assert.equal(actualSalt, "expectedSalt");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(22);
  });

  test("hash", async () => {
    bcrypt.hash.mockResolvedValue("crispy");
    let actualHash = await hash("foo", "bar");
    assert.equal(actualHash, "crispy");
    expect(bcrypt.hash).toHaveBeenCalledWith("foo", "bar");
  });

  test("encrypt", async () => {
    bcrypt.genSalt.mockResolvedValue("expectedSalt");
    bcrypt.hash.mockResolvedValue("crispy");
    const result = await encrypt("foo", 22);
    assert.deepEqual(result, {
      salt: "expectedSalt",
      hash: "crispy",
    });
    expect(bcrypt.hash).toHaveBeenCalledWith("foo", "expectedSalt");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(22);

    await encrypt("foo");
    expect(bcrypt.genSalt).toHaveBeenCalledWith(DefaultNumberOfSaltRounds);
  });
});
