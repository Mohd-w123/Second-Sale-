import QuizConfig from '../models/QuizConfig.js';
import { DEFAULT_QUIZZES } from '../utils/defaultQuizData.js';

export const getQuizByCategory = async (req, res, next) => {
  try {
    const category = (req.params.category || '').toLowerCase().trim();
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    let quiz = await QuizConfig.findOne({ category });

    // Auto-seed default if not yet stored
    if (!quiz) {
      const defaultData = DEFAULT_QUIZZES[category];
      if (defaultData) {
        quiz = await QuizConfig.create(defaultData);
      }
    }

    if (!quiz) {
      return res.status(404).json({ message: `No quiz configuration found for category: ${category}` });
    }

    res.json(quiz);
  } catch (error) {
    next(error);
  }
};

export const updateQuizByCategory = async (req, res, next) => {
  try {
    const category = (req.params.category || '').toLowerCase().trim();
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    const { steps, isActive } = req.body;

    const quiz = await QuizConfig.findOneAndUpdate(
      { category },
      {
        category,
        steps: steps || [],
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: 'Quiz configuration updated successfully',
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const resetQuizToDefaults = async (req, res, next) => {
  try {
    const category = (req.params.category || '').toLowerCase().trim();
    const defaultData = DEFAULT_QUIZZES[category];

    if (!defaultData) {
      return res.status(404).json({ message: `No default template exists for category: ${category}` });
    }

    const quiz = await QuizConfig.findOneAndUpdate(
      { category },
      defaultData,
      { new: true, upsert: true }
    );

    res.json({
      message: `Quiz configuration for ${category} reset to default`,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQuizCategories = async (req, res, next) => {
  try {
    const quizzes = await QuizConfig.find().select('category updatedAt isActive steps');
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};
