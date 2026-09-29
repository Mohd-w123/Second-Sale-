import QuizConfig from '../models/QuizConfig.js';
import { DEFAULT_QUIZZES, QUIZ_SEED_VERSION } from '../utils/defaultQuizData.js';

export const getQuizByCategory = async (req, res, next) => {
  try {
    const category = (req.params.category || '').toLowerCase().trim();
    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    let quiz = await QuizConfig.findOne({ category });

    // Auto-seed default if not yet stored
    if (!quiz) {
      const defaultData = DEFAULT_QUIZZES[category] || {
        category,
        steps: [
          {
            id: `${category}_basic_details`,
            label: 'Device Details',
            subtitle: `Evaluation questions for ${category}`,
            questions: [
              {
                id: `${category}_power_on`,
                title: 'Does your device turn on and function properly?',
                subtitle: 'Check basic power and operational functionality.',
                type: 'yes_no',
                required: true,
                options: [
                  { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
                  { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 70, isNegative: true },
                ],
              },
              {
                id: `${category}_condition`,
                title: 'What is the physical condition of the device?',
                subtitle: 'Inspect for scratches, scuffs, or dents.',
                type: 'single_choice',
                required: true,
                options: [
                  { id: 'flawless', label: 'Flawless (Like New)', deductionType: 'percentage', deductionValue: 0, isNegative: false },
                  { id: 'minor_scratches', label: '1-2 Minor Scratches', deductionType: 'percentage', deductionValue: 8, isNegative: true },
                  { id: 'heavy_scratches', label: 'Heavy Scratches / Dents', deductionType: 'percentage', deductionValue: 20, isNegative: true },
                ],
              },
            ],
          },
        ],
        isActive: true,
      };

      quiz = await QuizConfig.findOneAndUpdate(
        { category },
        defaultData,
        { new: true, upsert: true }
      );
    }

    // ── Smart merge: add new default questions, preserve existing admin customizations ──
    // When seedVersion is stale, we ADD questions that are new in the default config
    // WITHOUT overwriting admin-set deduction values on existing questions/options.
    const currentDefaultVersion = DEFAULT_QUIZZES[category]?.seedVersion ?? 1;
    const storedVersion = quiz?.seedVersion ?? 1;

    if (storedVersion < currentDefaultVersion && DEFAULT_QUIZZES[category]) {
      const newDefault = DEFAULT_QUIZZES[category];

      // Convert Mongoose doc to plain JS object for easy manipulation
      const storedObj = quiz.toObject();

      // Build maps:
      // - storedQuestionIds: IDs of all questions currently in DB
      // - defaultQuestionMap: default question objects by ID
      const storedQuestionIds = new Set(
        storedObj.steps.flatMap(s => (s.questions || []).map(q => q.id))
      );
      const defaultQuestionMap = new Map();
      for (const step of newDefault.steps) {
        for (const q of (step.questions || [])) {
          defaultQuestionMap.set(q.id, q);
        }
      }

      let questionsAdded = 0;
      let questionsUpdated = 0;

      // Merge: for each stored step, process its questions
      const mergedSteps = storedObj.steps.map(storedStep => {
        const defaultStep = newDefault.steps.find(s => s.id === storedStep.id);
        if (!defaultStep) return storedStep;

        // Process existing stored questions:
        // - sub_ questions (sub-defect config): REPLACE with latest default (deduction values may have changed)
        // - Regular questions: KEEP stored (admin may have customized values)
        const updatedQuestions = (storedStep.questions || []).map(storedQ => {
          const defaultQ = defaultQuestionMap.get(storedQ.id);
          if (!defaultQ) return storedQ; // Admin-added question → keep

          // Sub-defect config questions always get updated to latest calibrated values
          if (storedQ.id.startsWith('sub_')) {
            questionsUpdated++;
            return defaultQ; // Full replacement with new calibrated values
          }

          // Regular questions: preserve admin customizations
          return storedQ;
        });

        // Add entirely new questions from default that don't exist in stored
        const newQuestions = (defaultStep.questions || []).filter(
          q => !storedQuestionIds.has(q.id)
        );
        if (newQuestions.length > 0) questionsAdded += newQuestions.length;

        return { ...storedStep, questions: [...updatedQuestions, ...newQuestions] };
      });

      // Add entirely new steps from default that don't exist in stored
      const storedStepIds = new Set(storedObj.steps.map(s => s.id));
      const newSteps = newDefault.steps.filter(s => !storedStepIds.has(s.id));
      if (newSteps.length > 0) questionsAdded += newSteps.reduce((a, s) => a + (s.questions?.length || 0), 0);

      console.log(`[Quiz] Smart-merged ${category} quiz v${storedVersion}→v${currentDefaultVersion}: +${questionsAdded} new, ~${questionsUpdated} sub-configs updated, admin customizations preserved`);

      quiz = await QuizConfig.findOneAndUpdate(
        { category },
        { steps: [...mergedSteps, ...newSteps], seedVersion: currentDefaultVersion },
        { new: true, upsert: true }
      );
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

    // Sanitize and ensure valid schema values
    const cleanSteps = (steps || []).map((step, sIdx) => ({
      id: step.id || `step_${sIdx}_${Date.now()}`,
      label: step.label || `Step ${sIdx + 1}`,
      subtitle: step.subtitle || '',
      questions: (step.questions || []).map((q, qIdx) => ({
        id: q.id || `q_${sIdx}_${qIdx}_${Date.now()}`,
        title: q.title || `Question ${qIdx + 1}`,
        subtitle: q.subtitle || '',
        type: ['yes_no', 'single_choice', 'multi_choice'].includes(q.type) ? q.type : 'yes_no',
        required: q.required !== undefined ? Boolean(q.required) : true,
        options: (q.options || []).map((opt, oIdx) => ({
          id: opt.id || `opt_${sIdx}_${qIdx}_${oIdx}_${Date.now()}`,
          label: opt.label || `Option ${oIdx + 1}`,
          description: opt.description || '',
          icon: opt.icon || '',
          deductionType: opt.deductionType === 'flat_inr' ? 'flat_inr' : 'percentage',
          deductionValue: Number.isFinite(Number(opt.deductionValue)) ? Number(opt.deductionValue) : 0,
          isNegative: opt.isNegative !== undefined ? Boolean(opt.isNegative) : true,
        })),
      })),
    }));

    // When admin manually saves, mark it as the latest seed version so auto-reset doesn't clobber it
    const quiz = await QuizConfig.findOneAndUpdate(
      { category },
      {
        category,
        steps: cleanSteps,
        seedVersion: QUIZ_SEED_VERSION,
        isActive: isActive !== undefined ? isActive : true,
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json({
      message: 'Quiz configuration updated successfully',
      quiz,
    });
  } catch (error) {
    console.error('updateQuizByCategory error:', error);
    next(error);
  }
};

export const resetQuizToDefaults = async (req, res, next) => {
  try {
    const category = (req.params.category || '').toLowerCase().trim();
    const defaultData = DEFAULT_QUIZZES[category] || {
      category,
      steps: [
        {
          id: `${category}_details`,
          label: 'Device Details',
          subtitle: `Standard evaluation for ${category}`,
          questions: [
            {
              id: `${category}_functional`,
              title: 'Does the device power on and work properly?',
              subtitle: 'Verify power and general functionality.',
              type: 'yes_no',
              required: true,
              options: [
                { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
                { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 70, isNegative: true },
              ],
            },
          ],
        },
      ],
      isActive: true,
    };

    const quiz = await QuizConfig.findOneAndUpdate(
      { category },
      defaultData,
      { new: true, upsert: true }
    );

    res.json({
      message: `Quiz configuration for ${category} reset to Cashify-calibrated defaults (v${defaultData.seedVersion ?? 1})`,
      quiz,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllQuizCategories = async (req, res, next) => {
  try {
    const quizzes = await QuizConfig.find().select('category updatedAt isActive steps seedVersion');
    res.json(quizzes);
  } catch (error) {
    next(error);
  }
};
