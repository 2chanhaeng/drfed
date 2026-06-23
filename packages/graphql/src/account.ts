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
import { instanceMembers } from "@drfed/models/schema";
import { and, eq, isNotNull } from "drizzle-orm/sql/expressions";

import builder, { type DrFedObjectRef } from "./builder.ts";

const AccountRef = builder.drizzleNode("accounts", {
  name: "Account",
  description:
    "Represents an `Account` in the DrFed platform.  " +
    "Note that it differs from the ActivityPub `Actor`s that belong to `Instance`s.",
  id: {
    column(account) {
      return account.id;
    },
    description: "The unique identifier of the `Account`.",
  },
  fields: (t) => ({
    uuid: t.expose("id", {
      type: "UUID",
      description: "The UUID of the `Account`.",
    }),
    email: t.expose("email", {
      type: "Email",
      description: "The email address of the `Account`.",
    }),
    name: t.exposeString("name", {
      description: "The display name of the `Account`.",
    }),
    created: t.expose("created", {
      type: "DateTime",
      description: "The date/time when the `Account` was created.",
    }),
    // We can simplify the below connection by using `relatedConnection()`
    // when Drizzle ORM supports additional filters on the junction table
    // for relations.  See also the below issue:
    // https://github.com/drizzle-team/drizzle-orm/issues/5343
    instances: t.drizzleConnection({
      type: "instances",
      description: "The `Instance`s that the `Account` belongs to.",
      totalCount(parent, _args, ctx) {
        return ctx.db.$count(
          instanceMembers,
          and(
            eq(instanceMembers.accountId, parent.id),
            isNotNull(instanceMembers.accepted),
          ),
        );
      },
      resolve(query, parent, _args, ctx) {
        return ctx.db.query.instances.findMany(
          query({
            where: {
              instanceMembers: { accountId: parent.id },
            },
          }),
        );
      },
    }),
  }),
});

export const Account: DrFedObjectRef = AccountRef;

builder.queryFields((t) => ({
  accountByUuid: t.drizzleField({
    args: {
      uuid: t.arg({
        description: "The UUID of the `Account` to retrieve.",
        required: true,
        type: "UUID",
      }),
    },
    description: "Get an `Account` by its UUID.",
    nullable: true,
    resolve(query, _, { uuid }, ctx) {
      return ctx.db.query.accounts.findFirst(query({ where: { id: uuid } }));
    },
    type: AccountRef,
  }),
}));
