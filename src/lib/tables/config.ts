import type { FieldConfig, TableConfig } from "./types"

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
    {
      label: "Landlord leads",
      sourceTable: "landlord_leads",
      foreignKey: "property_id",
      columns: ["name", "email", "status", "source", "created_at"],
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
  avatarFields: ["first_name", "last_name"],
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
  formGroups: [
    {
      label: "Stay details",
      fields: [
        "uplisting_reservation_id",
        "channel",
        "status",
        "check_in",
        "check_out",
        "arrival_time",
        "room_number",
        "revenue",
      ],
    },
    {
      label: "Guest & contact",
      fields: ["guest_name_raw", "ota_email", "ota_phone", "ota_phone_reliable"],
    },
    { label: "Access", fields: ["lock_code", "checkin_token"] },
    { label: "System", fields: ["id", "confirmation_sent_at", "reminder_sent_at", "created_at"] },
  ],
}

const landlordLeads: TableConfig = {
  key: "landlord_leads",
  label: "Lead",
  pluralLabel: "Landlord Leads",
  route: "/leads",
  primaryKey: "id",
  listFields: ["name", "email", "phone", "status", "area", "current_revenue", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "name", label: "Name", type: "text", editable: true },
    { key: "email", label: "Email", type: "text", editable: true },
    { key: "phone", label: "Phone", type: "text", editable: true },
    { key: "company", label: "Company", type: "text", editable: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      editable: true,
      options: ["new", "contacted", "qualified", "converted", "declined"],
    },
    { key: "source", label: "Source", type: "text", editable: true },
    { key: "property_id", label: "Linked property", type: "uuid", editable: false },
    { key: "area", label: "Area", type: "text", editable: true },
    { key: "num_properties", label: "Number of properties", type: "text", editable: true },
    { key: "bedrooms", label: "Bedrooms", type: "text", editable: true },
    { key: "platforms", label: "Platforms", type: "text", editable: true },
    { key: "occupancy", label: "Occupancy", type: "text", editable: true },
    { key: "adr", label: "ADR", type: "text", editable: true },
    {
      key: "landlord_situation",
      label: "Landlord situation",
      type: "textarea",
      editable: true,
    },
    {
      key: "property_description",
      label: "Property description",
      type: "textarea",
      editable: true,
    },
    { key: "hours_per_week", label: "Hours per week", type: "number", editable: true },
    { key: "biggest_challenge", label: "Biggest challenge", type: "textarea", editable: true },
    { key: "current_revenue", label: "Current revenue", type: "number", editable: true },
    { key: "estimated_potential", label: "Estimated potential", type: "number", editable: true },
    { key: "estimated_uplift", label: "Estimated uplift", type: "number", editable: true },
    { key: "uplift_percent", label: "Uplift %", type: "number", editable: true },
    { key: "marketing_consent", label: "Marketing consent", type: "boolean", editable: false },
    {
      key: "marketing_consent_at",
      label: "Consent given at",
      type: "datetime",
      editable: false,
    },
    {
      key: "mailerlite_subscriber_id",
      label: "MailerLite subscriber ID",
      type: "text",
      editable: false,
    },
    {
      key: "mailerlite_synced_at",
      label: "MailerLite synced at",
      type: "datetime",
      editable: false,
    },
    { key: "created_at", label: "Created at", type: "datetime", editable: false },
    { key: "updated_at", label: "Updated at", type: "datetime", editable: false },
  ],
  relations: [{ field: "property_id", targetTable: "properties", labelFields: ["name"] }],
  formGroups: [
    { label: "Contact", fields: ["name", "email", "phone", "company"] },
    { label: "Lead status", fields: ["status", "source", "property_id"] },
    { label: "Marketing consent", fields: ["marketing_consent", "marketing_consent_at"] },
    {
      label: "Property details",
      fields: [
        "area",
        "num_properties",
        "bedrooms",
        "platforms",
        "occupancy",
        "adr",
        "landlord_situation",
        "property_description",
      ],
    },
    {
      label: "Revenue estimate",
      fields: [
        "current_revenue",
        "hours_per_week",
        "biggest_challenge",
        "estimated_potential",
        "estimated_uplift",
        "uplift_percent",
      ],
    },
    {
      label: "System",
      fields: [
        "id",
        "mailerlite_subscriber_id",
        "mailerlite_synced_at",
        "created_at",
        "updated_at",
      ],
    },
  ],
}

const contactQueries: TableConfig = {
  key: "contact_queries",
  label: "Contact Query",
  pluralLabel: "Contact Queries",
  route: "/contact-queries",
  primaryKey: "id",
  listFields: ["name", "email", "topic", "status", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "name", label: "Name", type: "text", editable: true },
    { key: "email", label: "Email", type: "text", editable: true },
    {
      key: "topic",
      label: "Topic",
      type: "select",
      editable: true,
      options: ["Media query", "About a booking", "Hiring", "Partnership", "Other"],
    },
    { key: "property_name", label: "Property name", type: "text", editable: true },
    { key: "message", label: "Message", type: "textarea", editable: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      editable: true,
      options: ["new", "in_progress", "resolved"],
    },
    {
      key: "mailerlite_subscriber_id",
      label: "MailerLite subscriber ID",
      type: "text",
      editable: false,
    },
    {
      key: "mailerlite_synced_at",
      label: "MailerLite synced at",
      type: "datetime",
      editable: false,
    },
    { key: "created_at", label: "Created at", type: "datetime", editable: false },
    { key: "updated_at", label: "Updated at", type: "datetime", editable: false },
  ],
  formGroups: [
    { label: "Query", fields: ["name", "email", "topic", "property_name", "message"] },
    { label: "Status", fields: ["status"] },
    {
      label: "System",
      fields: [
        "id",
        "mailerlite_subscriber_id",
        "mailerlite_synced_at",
        "created_at",
        "updated_at",
      ],
    },
  ],
}

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "declined"]

const mailerliteFields = [
  {
    key: "mailerlite_subscriber_id",
    label: "MailerLite subscriber ID",
    type: "text",
    editable: false,
  },
  {
    key: "mailerlite_synced_at",
    label: "MailerLite synced at",
    type: "datetime",
    editable: false,
  },
] as const satisfies FieldConfig[]

const systemFields = [
  { key: "created_at", label: "Created at", type: "datetime", editable: false },
  { key: "updated_at", label: "Updated at", type: "datetime", editable: false },
] as const satisfies FieldConfig[]

const partnerLeads: TableConfig = {
  key: "partner_leads",
  label: "Partner Lead",
  pluralLabel: "Partner Leads",
  route: "/partner-leads",
  primaryKey: "id",
  listFields: ["business_name", "contact_name", "email", "phone", "category", "status", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "business_name", label: "Business name", type: "text", editable: true },
    { key: "contact_name", label: "Contact name", type: "text", editable: true },
    { key: "email", label: "Email", type: "text", editable: true },
    { key: "phone", label: "Phone", type: "text", editable: true },
    { key: "website", label: "Website", type: "text", editable: true },
    { key: "category", label: "Category", type: "text", editable: true },
    { key: "location", label: "Location", type: "text", editable: true },
    { key: "about_business", label: "About the business", type: "textarea", editable: true },
    { key: "referral", label: "How they heard about us", type: "text", editable: true },
    { key: "status", label: "Status", type: "select", editable: true, options: LEAD_STATUSES },
    ...mailerliteFields,
    ...systemFields,
  ],
  formGroups: [
    { label: "Contact", fields: ["business_name", "contact_name", "email", "phone", "website"] },
    { label: "Business", fields: ["category", "location", "about_business", "referral"] },
    { label: "Lead status", fields: ["status"] },
    {
      label: "System",
      fields: ["id", "mailerlite_subscriber_id", "mailerlite_synced_at", "created_at", "updated_at"],
    },
  ],
}

const corporateLeads: TableConfig = {
  key: "corporate_leads",
  label: "Corporate Lead",
  pluralLabel: "Corporate Leads",
  route: "/corporate-leads",
  primaryKey: "id",
  listFields: ["name", "company", "email", "phone", "number_of_workers", "status", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "name", label: "Name", type: "text", editable: true },
    { key: "company", label: "Company", type: "text", editable: true },
    { key: "email", label: "Email", type: "text", editable: true },
    { key: "phone", label: "Phone", type: "text", editable: true },
    { key: "location_needed", label: "Location needed", type: "text", editable: true },
    { key: "number_of_workers", label: "Number of workers", type: "text", editable: true },
    { key: "duration", label: "Duration", type: "text", editable: true },
    { key: "message", label: "Message", type: "textarea", editable: true },
    { key: "status", label: "Status", type: "select", editable: true, options: LEAD_STATUSES },
    ...mailerliteFields,
    ...systemFields,
  ],
  formGroups: [
    { label: "Contact", fields: ["name", "company", "email", "phone"] },
    { label: "Requirement", fields: ["location_needed", "number_of_workers", "duration", "message"] },
    { label: "Lead status", fields: ["status"] },
    {
      label: "System",
      fields: ["id", "mailerlite_subscriber_id", "mailerlite_synced_at", "created_at", "updated_at"],
    },
  ],
}

const newsletterSubscribers: TableConfig = {
  key: "newsletter_subscribers",
  label: "Subscriber",
  pluralLabel: "Newsletter Subscribers",
  route: "/newsletter",
  primaryKey: "id",
  listFields: ["email", "status", "source", "created_at"],
  fields: [
    { key: "id", label: "ID", type: "uuid", editable: false },
    { key: "email", label: "Email", type: "text", editable: true },
    {
      key: "status",
      label: "Status",
      type: "select",
      editable: true,
      options: ["subscribed", "unsubscribed"],
    },
    { key: "source", label: "Source", type: "text", editable: true },
    ...mailerliteFields,
    ...systemFields,
  ],
  formGroups: [
    { label: "Subscriber", fields: ["email", "status", "source"] },
    {
      label: "System",
      fields: ["id", "mailerlite_subscriber_id", "mailerlite_synced_at", "created_at", "updated_at"],
    },
  ],
}

export const tableConfigs = {
  properties,
  guests,
  bookings,
  landlord_leads: landlordLeads,
  contact_queries: contactQueries,
  partner_leads: partnerLeads,
  corporate_leads: corporateLeads,
  newsletter_subscribers: newsletterSubscribers,
} satisfies Record<string, TableConfig>

export type TableKey = keyof typeof tableConfigs
