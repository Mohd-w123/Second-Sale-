import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '' },
  deductionType: {
    type: String,
    enum: ['percentage', 'flat_inr'],
    default: 'percentage',
  },
  deductionValue: { type: Number, default: 0 },
  isNegative: { type: Boolean, default: true },
}, { _id: false });

const questionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  type: {
    type: String,
    enum: ['yes_no', 'single_choice', 'multi_choice'],
    default: 'yes_no',
  },
  required: { type: Boolean, default: true },
  options: [optionSchema],
}, { _id: false });

const stepSchema = new mongoose.Schema({
  id: { type: String, required: true },
  label: { type: String, required: true },
  subtitle: { type: String, default: '' },
  questions: [questionSchema],
}, { _id: false });

const quizConfigSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  steps: [stepSchema],
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const QuizConfig = mongoose.model('QuizConfig', quizConfigSchema);
export default QuizConfig;
