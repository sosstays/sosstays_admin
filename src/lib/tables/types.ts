export type FieldType =
  | "text"
  | "textarea"
  | "boolean"
  | "number"
  | "date"
  | "datetime"
  | "time"
  | "uuid"
  | "select"

export interface FieldConfig {
  /** Column name in the underlying table. */
  key: string
  label: string
  type: FieldType
  /** Whether this field can be changed via the edit form. */
  editable: boolean
  /** Allowed values for type "select" — matches a DB CHECK constraint's enum. */
  options?: string[]
}

/** A forward foreign-key relation, e.g. bookings.property_id -> properties. */
export interface RelationConfig {
  /** The FK column on this table, e.g. "property_id". */
  field: string
  /** Config key of the table being referenced, e.g. "properties". */
  targetTable: string
  /** Fields on the target row to join together for display, e.g. ["name"] or ["first_name", "last_name"]. */
  labelFields: string[]
}

/** A reverse relation shown as a read-only list on a detail page, e.g. a guest's bookings. */
export interface RelatedListConfig {
  label: string
  /** Config key of the table holding the related rows, e.g. "bookings". */
  sourceTable: string
  /** FK column on the related table pointing back to this record, e.g. "guest_id". */
  foreignKey: string
  /** Columns (from the related table) to show in the list. */
  columns: string[]
}

/** A group of fields shown together as one card on a detail/edit page. Presentation only. */
export interface FormGroupConfig {
  label: string
  fields: string[]
}

/** A one-click list filter on whether a field is empty, e.g. "No booking" for a null booking_id. */
export interface QuickFilterConfig {
  label: string
  field: string
  /** true keeps rows where the field is empty; false keeps rows where it is set. */
  empty: boolean
}

export interface TableConfig {
  key: string
  label: string
  pluralLabel: string
  route: string
  primaryKey: string
  fields: FieldConfig[]
  /** Field keys shown as columns in the list view, in order. */
  listFields: string[]
  relations?: RelationConfig[]
  relatedLists?: RelatedListConfig[]
  /** Field keys combined into initials for a small avatar in the list view (e.g. guest name). */
  avatarFields?: string[]
  /** Groups the edit form's fields into stacked cards, in order. Fields left out fall into a trailing "Details" group. */
  formGroups?: FormGroupConfig[]
  /** Extra filter pills shown above the list, next to the status pills. */
  quickFilters?: QuickFilterConfig[]
}

export function getField(config: TableConfig, key: string): FieldConfig {
  const field = config.fields.find((f) => f.key === key)
  if (!field) {
    throw new Error(`Unknown field "${key}" on table "${config.key}"`)
  }
  return field
}
