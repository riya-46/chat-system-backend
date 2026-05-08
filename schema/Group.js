const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    batch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Batch',
      required: true,
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    members: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
      validate: {
        validator: (arr) => arr.length <= 7,
        message: 'A group cannot have more than 7 members',
      },
    },
    is_archived: {
      type: Boolean,
      default: false,
    },
    archived_at: {
      type: Date,
      default: null,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

GroupSchema.index(
  { batch_id: 1, name: 1 },
  { unique: true, partialFilterExpression: { deleted_at: null } }
);

GroupSchema.index({ manager_id: 1 }, { sparse: true });
GroupSchema.index({ members: 1 });

// ✅ FIXED middleware
GroupSchema.pre(/^find/, function () {
  if (!this.getOptions().includeDeleted) {
    this.where({ deleted_at: null });
  }
});

module.exports = mongoose.model('Group', GroupSchema);