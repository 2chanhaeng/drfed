// DrFed: A web-based platform for developing and debugging ActivityPub apps
// Copyright (C) 2026 DrFed team
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
import assert from "node:assert/strict";

import { normalizeEmail } from "@drfed/models/email";
import { describe, it } from "@logtape/testing-node/autoload";

describe("normalizeEmail()", () => {
  it("with valid email", () => {
    assert.deepEqual(normalizeEmail("test@example.com"), "test@example.com");
    assert.deepEqual(
      normalizeEmail("  test@example.com  "),
      "test@example.com",
    );
    assert.deepEqual(normalizeEmail("Test@EXAMPLE.COM"), "Test@example.com");
    assert.deepEqual(
      normalizeEmail("user@中文.example"),
      "user@xn--fiq228c.example",
    );
  });

  it("with null and undefined", () => {
    assert.deepEqual(normalizeEmail(null), null);
    assert.deepEqual(normalizeEmail(undefined), undefined);
  });

  it("with invalid email", () => {
    assert.throws(
      () => normalizeEmail("invalid"),
      (e) =>
        e instanceof TypeError && e.message.includes("Invalid email format."),
    );
    assert.throws(
      () => normalizeEmail("@example.com"),
      (e) =>
        e instanceof TypeError && e.message.includes("Invalid email format."),
    );
    assert.throws(
      () => normalizeEmail("test@"),
      (e) =>
        e instanceof TypeError && e.message.includes("Invalid email format."),
    );
    assert.throws(
      () => normalizeEmail("test@example@com"),
      (e) =>
        e instanceof TypeError && e.message.includes("Invalid email format."),
    );
  });
});
