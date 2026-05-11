const mongoose = require("mongoose");

/* ══════════════════════════════════════════════════════
   USER
   - password now stores bcrypt hash
   - isActive flag for agent enable/disable
   - lastLogin tracking
══════════════════════════════════════════════════════ */
const userSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, default: "" },          // bcrypt hash
    phone:     { type: String, default: "" },
    userType:  { type: String, enum: ["Ordinary", "Agent", "Admin"], default: "Ordinary" },
    googleId:  { type: String, default: null },
    picture:   { type: String, default: null },
    isActive:  { type: Boolean, default: true },       // admin can deactivate agents/users
    lastLogin: { type: Date, default: null },
    resetOtp:          { type: String, default: null },
    resetOtpExpiry:    { type: Date,   default: null },
  },
  { timestamps: true }
);

/* ══════════════════════════════════════════════════════
   COMPLAINT
   - email field so notification emails work
   - category for filtering
   - sentiment for AI badge
   - All existing fields preserved
══════════════════════════════════════════════════════ */
const complaintSchema = new mongoose.Schema(
  {
    userId:    { type: String, required: true },
    name:      { type: String },
    email:     { type: String },           // user email — needed for notification emails
    phone:     { type: String },
    city:      { type: String },
    state:     { type: String },
    address:   { type: String },
    pincode:   { type: String },
    comment:   { type: String },
    category:  { type: String, default: "General" },
    status:    { type: String, default: "Pending",
                 enum: ["Pending","In Progress","Resolved","Rejected","Escalated","Withdrawn"] },
    priority:  { type: String, enum: ["urgent","high","medium","low","Urgent","High","Medium","Low"], default: "medium" },
    sentiment: { type: String, enum: ["Angry","Neutral","Polite"], default: "Neutral" },
    dueAt:     { type: Date, default: null },
    resolvedAt:{ type: Date, default: null },
    csatRating:{ type: Number, min: 1, max: 5, default: null },
    attachments: [{ name: String, url: String }],
    timeline: [{
      action: { type: String },
      note:   { type: String },
      by:     { type: String },
      at:     { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

/* ══════════════════════════════════════════════════════
   ASSIGNED COMPLAINT
   - agentName stored for quick display
   - assignedAt timestamp
══════════════════════════════════════════════════════ */
const assignedComplaintSchema = new mongoose.Schema(
  {
    complaintId: { type: String, required: true },
    agentId:     { type: String, required: true },
    agentName:   { type: String, default: "" },
    status:      { type: String, default: "Pending" },
  },
  { timestamps: true }
);

/* ══════════════════════════════════════════════════════
   MESSAGE
══════════════════════════════════════════════════════ */
const messageSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true },
    message:     { type: String, required: true },
    complaintId: { type: String, required: true },
  },
  { timestamps: true }
);

/* ══════════════════════════════════════════════════════
   NOTIFICATION
   - supports both agent and admin targets
   - type field for icon/color
══════════════════════════════════════════════════════ */
const notificationSchema = new mongoose.Schema(
  {
    agentId:    { type: String, required: true },
    icon:       { type: String, default: "🔔" },
    message:    { type: String, required: true },
    type:       { type: String, enum: ["assignment","status","escalation","general"], default: "general" },
    read:       { type: Boolean, default: false },
    complaintId:{ type: String, default: null },
  },
  { timestamps: true }
);

/* ══════════════════════════════════════════════════════
   AUDIT LOG  (new)
   Tracks every admin/agent action for accountability
══════════════════════════════════════════════════════ */
const auditLogSchema = new mongoose.Schema(
  {
    actorId:    { type: String, required: true },
    actorName:  { type: String, required: true },
    actorType:  { type: String, enum: ["Admin","Agent","Ordinary"], default: "Admin" },
    action:     { type: String, required: true },   // e.g. "ASSIGN_COMPLAINT"
    target:     { type: String },                   // e.g. complaintId or userId
    detail:     { type: String },                   // human-readable detail
    ip:         { type: String, default: null },
  },
  { timestamps: true }
);

const UserSchema        = mongoose.model("User",              userSchema);
const ComplaintSchema   = mongoose.model("Complaint",         complaintSchema);
const AssignedComplaint = mongoose.model("AssignedComplaint", assignedComplaintSchema);
const MessageSchema     = mongoose.model("Message",           messageSchema);
const Notification      = mongoose.model("Notification",      notificationSchema);
const AuditLog          = mongoose.model("AuditLog",          auditLogSchema);

module.exports = {
  UserSchema,
  ComplaintSchema,
  AssignedComplaint,
  MessageSchema,
  Notification,
  AuditLog,
};