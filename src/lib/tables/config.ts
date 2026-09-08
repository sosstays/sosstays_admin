import type { TableConfig } from "./types"

const properties: TableConfig = {
  key: "properties",
  label: "Property",
  pluralLabel: "Properties",
  route: "/properties",
  primaryKey: "id",
  listFields: ["name", "nickname", "uplisting_listing_id", "checkin_subdomain"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "name", label: "Name", type: "text", editable: true },
    { key: "nickname", label: "Nickname", type: "text", editable: true },
    {
      key: "uplisting_listing_id",
      label: "Uplisting listing ID",
      type: "text",
      editable: true,
    },
    {
      key: "checkin_subdomain",
      label: "Check-in subdomain",
      type: "text",
      editable: true,
    },
    {
      key: "access_instructions",
      label: "Access instructions",
      type: "textarea",
      editable: true,
    },
  ],
  relatedLists: [
    {
      label: "Bookings",
      sourceTable: "bookings",
      foreignKey: "property_id",
      columns: [
        "guest_name_raw",
        "check_in",
        "check_out",
        "status",
        "channel",
        "revenue",
        "room_number",
      ],
    },
  ],
}

const guests: TableConfig = {
  key: "guests",
  label: "Guest",
  pluralLabel: "Guests",
  route: "/guests",
  primaryKey: "id",
  listFields: ["first_name", "last_name", "email", "phone", "email_verified", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "first_name", label: "First name", type: "text", editable: true },
    { key: "last_name", label: "Last name", type: "text", editable: true },
    { key: "email", label: "Email", type: "text", editable: true },
    { key: "phone", label: "Phone", type: "text", editable: true },
    {
      key: "email_verified",
      label: "Email verified",
      type: "boolean",
      editable: true,
    },
    {
      key: "mailerlite_synced_at",
      label: "MailerLite synced at",
      type: "datetime",
      editable: false,
    },
    { key: "auth_user_id", label: "Auth user ID", type: "uuid", editable: false },
    { key: "created_at", label: "Created at", type: "datetime", editable: false },
  ],
  relatedLists: [
    {
      label: "Bookings",
      sourceTable: "bookings",
      foreignKey: "guest_id",
      columns: [
        "property_id",
        "check_in",
        "check_out",
        "status",
        "channel",
        "revenue",
        "room_number",
        "lock_code",
        "arrival_time",
      ],
    },
  ],
}

const bookings: TableConfig = {
  key: "bookings",
  label: "Booking",
  pluralLabel: "Bookings",
  route: "/bookings",
  primaryKey: "id",
  listFields: [
    "property_id",
    "guest_id",
    "check_in",
    "check_out",
    "status",
    "channel",
    "revenue",
  ],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    {
      key: "uplisting_reservation_id",
      label: "Uplisting reservation ID",
      type: "text",
      editable: true,
    },
    { key: "property_id", label: "Property", type: "uuid", editable: false },
    { key: "guest_id", label: "Guest", type: "uuid", editable: false },
    { key: "channel", label: "Channel", type: "text", editable: true },
    { key: "status", label: "Status", type: "text", editable: true },
    {
      key: "guest_name_raw",
      label: "Guest name (raw)",
      type: "text",
      editable: true,
    },
    { key: "ota_email", label: "OTA email", type: "text", editable: true },
    { key: "ota_phone", label: "OTA phone", type: "text", editable: true },
    {
      key: "ota_phone_reliable",
      label: "OTA phone reliable",
      type: "boolean",
      editable: true,
    },
    { key: "check_in", label: "Check-in", type: "date", editable: true },
    { key: "check_out", label: "Check-out", type: "date", editable: true },
    { key: "arrival_time", label: "Arrival time", type: "time", editable: true },
    { key: "revenue", label: "Revenue", type: "number", editable: true },
    { key: "room_number", label: "Room number", type: "text", editable: true },
    { key: "lock_code", label: "Lock code", type: "text", editable: true },
    {
      key: "checkin_token",
      label: "Check-in token",
      type: "uuid",
      editable: true,
    },
    {
      key: "confirmation_sent_at",
      label: "Confirmation sent at",
      type: "datetime",
      editable: false,
    },
    {
      key: "reminder_sent_at",
      label: "Reminder sent at",
      type: "datetime",
      editable: false,
    },
    { key: "created_at", label: "Created at", type: "datetime", editable: false },
  ],
  relations: [
    { field: "property_id", targetTable: "properties", labelFields: ["name"] },
    { field: "guest_id", targetTable: "guests", labelFields: ["first_name", "last_name"] },
  ],
}

export const tableConfigs = {
  properties,
  guests,
  bookings,
} satisfies Record<string, TableConfig>

export type TableKey = keyof typeof tableConfigs
