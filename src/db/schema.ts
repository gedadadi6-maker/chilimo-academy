import { relations } from 'drizzle-orm';
import { integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  loginId: text('login_id').unique(),
  systemId: text('system_id'),
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull().default('student'),
  status: text('status').notNull().default('active'),
  departmentOrGrade: text('department_or_grade'),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const applications = pgTable('applications', {
  id: serial('id').primaryKey(),
  trackingCode: text('tracking_code').notNull().unique(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  applicantType: text('applicant_type').notNull(),
  gradeOrSubject: text('grade_or_subject').notNull(),
  details: text('details').notNull(),
  stage: text('stage').notNull().default('pending'),
  adminNotes: text('admin_notes'),
  submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const schoolSnapshots = pgTable('school_snapshots', {
  id: serial('id').primaryKey(),
  moduleKey: text('module_key').notNull().unique(),
  payloadJson: jsonb('payload_json').notNull(),
  updatedByUid: text('updated_by_uid'),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const backupArchives = pgTable('backup_archives', {
  id: serial('id').primaryKey(),
  backupCode: text('backup_code').notNull().unique(),
  label: text('label').notNull(),
  createdByUid: text('created_by_uid').notNull(),
  createdByEmail: text('created_by_email').notNull(),
  totalModules: integer('total_modules').notNull().default(0),
  totalRecords: integer('total_records').notNull().default(0),
  snapshotJson: jsonb('snapshot_json').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  action: text('action').notNull(),
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  auditLogs: many(auditLogs),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  actor: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
