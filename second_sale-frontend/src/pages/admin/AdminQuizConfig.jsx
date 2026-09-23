import { useState, useEffect } from 'react';
import { quizService } from '../../services/quiz.service';
import Loader from '../../components/ui/Loader';
import {
  HelpCircle,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Layers,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Laptop,
  Tablet,
  Watch,
  Headphones,
  Gamepad,
  Tv,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'mobile', label: 'Mobile Phones', icon: Smartphone },
  { id: 'laptop', label: 'Laptops', icon: Laptop },
  { id: 'tablet', label: 'Tablets', icon: Tablet },
  { id: 'tv', label: 'Televisions', icon: Tv },
  { id: 'smartwatch', label: 'Smartwatches', icon: Watch },
  { id: 'earbuds', label: 'Earbuds', icon: Headphones },
  { id: 'gaming', label: 'Gaming Consoles', icon: Gamepad },
];

export default function AdminQuizConfig() {
  const [activeCategory, setActiveCategory] = useState('mobile');
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [openStepIndex, setOpenStepIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;
    quizService.getQuizByCategory(activeCategory)
      .then((data) => {
        if (isMounted) {
          setQuizData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error(err);
          setError(err?.response?.data?.message || 'Failed to load quiz configuration.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleStepFieldChange = (sIdx, field, val) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      nextSteps[sIdx] = { ...nextSteps[sIdx], [field]: val };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleQuestionFieldChange = (sIdx, qIdx, field, val) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      const nextQuestions = [...nextSteps[sIdx].questions];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], [field]: val };
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleOptionFieldChange = (sIdx, qIdx, oIdx, field, val) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      const nextQuestions = [...nextSteps[sIdx].questions];
      const nextOptions = [...nextQuestions[qIdx].options];
      nextOptions[oIdx] = { ...nextOptions[oIdx], [field]: val };
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], options: nextOptions };
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleAddOption = (sIdx, qIdx) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      const nextQuestions = [...nextSteps[sIdx].questions];
      const nextOptions = [
        ...nextQuestions[qIdx].options,
        {
          id: `custom_opt_${Date.now()}`,
          label: 'New Condition / Issue',
          description: '',
          deductionType: 'percentage',
          deductionValue: 5,
          isNegative: true,
        },
      ];
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], options: nextOptions };
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleDeleteOption = (sIdx, qIdx, oIdx) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      const nextQuestions = [...nextSteps[sIdx].questions];
      const nextOptions = nextQuestions[qIdx].options.filter((_, idx) => idx !== oIdx);
      nextQuestions[qIdx] = { ...nextQuestions[qIdx], options: nextOptions };
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleAddQuestion = (sIdx) => {
    setQuizData((prev) => {
      const nextSteps = [...prev.steps];
      const nextQuestions = [
        ...nextSteps[sIdx].questions,
        {
          id: `custom_q_${Date.now()}`,
          title: 'New Evaluation Question',
          subtitle: 'Please provide accurate information',
          type: 'yes_no',
          required: true,
          options: [
            { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
            { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 10, isNegative: true },
          ],
        },
      ];
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleDeleteQuestion = (sIdx, qIdx) => {
    setQuizData((prev) => {
      if (!prev?.steps?.[sIdx]) return prev;
      const nextSteps = [...prev.steps];
      const nextQuestions = nextSteps[sIdx].questions.filter((_, idx) => idx !== qIdx);
      nextSteps[sIdx] = { ...nextSteps[sIdx], questions: nextQuestions };
      return { ...prev, steps: nextSteps };
    });
  };

  const handleDeleteStep = (sIdx) => {
    setQuizData((prev) => {
      if (!prev?.steps) return prev;
      const nextSteps = prev.steps.filter((_, idx) => idx !== sIdx);
      return { ...prev, steps: nextSteps };
    });
  };

  const handleAddStep = () => {
    setQuizData((prev) => {
      const newStep = {
        id: `step_${Date.now()}`,
        label: 'New Section',
        subtitle: 'Evaluation questions for this step',
        questions: [
          {
            id: `q_${Date.now()}`,
            title: 'New Evaluation Question',
            subtitle: 'Please answer accurately',
            type: 'yes_no',
            required: true,
            options: [
              { id: 'yes', label: 'Yes', deductionType: 'percentage', deductionValue: 0, isNegative: false },
              { id: 'no', label: 'No', deductionType: 'percentage', deductionValue: 10, isNegative: true },
            ],
          },
        ],
      };
      return { ...prev, steps: [...(prev?.steps || []), newStep] };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setError(null);
    try {
      await quizService.updateQuizByCategory(activeCategory, quizData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to save quiz changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm(`Reset ${activeCategory.toUpperCase()} quiz to Cashify defaults? Any unsaved edits will be lost.`)) {
      return;
    }
    setLoading(true);
    try {
      const res = await quizService.resetQuizToDefaults(activeCategory);
      setQuizData(res.quiz);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to reset quiz.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-7 h-7 text-[#087F8C]" />
            <h1 className="text-2xl font-bold text-slate-900">Dynamic Quiz & Deductions Manager</h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure steps, evaluation questions, options, and deduction rates (% or ₹) per device category.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition shadow-sm"
          >
            <RotateCcw className="w-4 h-4 text-slate-500" />
            Reset to Defaults
          </button>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="admin-btn admin-btn-primary flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-lg shadow-sm transition disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Quiz Changes'}
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 p-4 text-[#087F8C] bg-[#E8F6F7] border border-[#087F8C]/30 rounded-lg animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-[#087F8C] flex-shrink-0" />
          <span className="text-sm font-medium">Quiz configuration saved successfully! Quotes will now evaluate dynamically.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-4 text-red-800 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                isActive
                  ? 'bg-[#087F8C] text-white shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : !quizData?.steps?.length ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-xl p-8">
          <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">No Quiz Configuration Found</h3>
          <p className="text-sm text-slate-500 mt-1 mb-4">
            Initialize this category with default Cashify questions.
          </p>
          <button
            onClick={handleReset}
            className="admin-btn admin-btn-primary px-4 py-2 text-sm font-medium rounded-lg transition"
          >
            Seed Cashify Defaults
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {quizData.steps.map((step, sIdx) => {
            const isOpen = openStepIndex === sIdx;
            return (
              <div
                key={step.id || sIdx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition"
              >
                {/* Step Header Accordion */}
                <div
                  onClick={() => setOpenStepIndex(isOpen ? null : sIdx)}
                  className="flex items-center justify-between p-4.5 bg-slate-50 hover:bg-slate-100 cursor-pointer border-b border-slate-200 select-none transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#E8F6F7] text-[#087F8C] font-bold text-xs flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900">{step.label}</h3>
                      <p className="text-xs text-slate-500">{step.subtitle || `${step.questions?.length || 0} questions`}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 bg-white border border-slate-200 rounded-md font-medium text-slate-600">
                      {step.questions?.length || 0} Questions
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteStep(sIdx);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition border border-transparent hover:border-red-200"
                      title="Delete Entire Step Section"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500" />
                    )}
                  </div>
                </div>

                {/* Step Content */}
                {isOpen && (
                  <div className="p-6 space-y-6">
                    {/* Step Title & Subtitle Edit */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-lg border border-slate-200">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Step Label</label>
                        <input
                          type="text"
                          value={step.label || ''}
                          onChange={(e) => handleStepFieldChange(sIdx, 'label', e.target.value)}
                          className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[#087F8C]/20 focus:border-[#087F8C] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Step Subtitle</label>
                        <input
                          type="text"
                          value={step.subtitle || ''}
                          onChange={(e) => handleStepFieldChange(sIdx, 'subtitle', e.target.value)}
                          className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[#087F8C]/20 focus:border-[#087F8C] focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Questions in this Step */}
                    <div className="space-y-6">
                      {step.questions?.map((q, qIdx) => (
                        <div
                          key={q.id || qIdx}
                          className="border border-slate-200 rounded-lg p-5 bg-white space-y-4 shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Question Title
                                </label>
                                <input
                                  type="text"
                                  value={q.title || ''}
                                  onChange={(e) => handleQuestionFieldChange(sIdx, qIdx, 'title', e.target.value)}
                                  className="w-full text-sm font-medium px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[#087F8C]/20 focus:border-[#087F8C] focus:outline-none"
                                />
                              </div>

                              <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Question Type
                                </label>
                                <select
                                  value={q.type || 'yes_no'}
                                  onChange={(e) => handleQuestionFieldChange(sIdx, qIdx, 'type', e.target.value)}
                                  className="w-full text-sm px-3 py-2 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-[#087F8C]/20 focus:border-[#087F8C] focus:outline-none"
                                >
                                  <option value="yes_no">Yes / No</option>
                                  <option value="single_choice">Single Choice (Radio)</option>
                                  <option value="multi_choice">Multi Choice (Grid/Checkboxes)</option>
                                </select>
                              </div>

                              <div className="md:col-span-3">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                  Question Subtitle / Helper
                                </label>
                                <input
                                  type="text"
                                  value={q.subtitle || ''}
                                  onChange={(e) => handleQuestionFieldChange(sIdx, qIdx, 'subtitle', e.target.value)}
                                  className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-md focus:ring-2 focus:ring-[#087F8C]/20 focus:border-[#087F8C] focus:outline-none"
                                />
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteQuestion(sIdx, qIdx);
                              }}
                              className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 border border-transparent hover:border-red-200 transition flex items-center gap-1 flex-shrink-0"
                              title="Delete Question"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                              <span className="text-xs font-semibold text-red-600 hidden sm:inline">Delete</span>
                            </button>
                          </div>

                          {/* Options Table */}
                          <div className="mt-3 border-t border-slate-100 pt-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Answer Options & Deductions
                              </span>
                              <button
                                onClick={() => handleAddOption(sIdx, qIdx)}
                                className="flex items-center gap-1 text-xs font-semibold text-[#087F8C] hover:text-[#116466]"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Option
                              </button>
                            </div>

                            <div className="space-y-2">
                              {q.options?.map((opt, oIdx) => (
                                <div
                                  key={opt.id || oIdx}
                                  className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-md border border-slate-200"
                                >
                                  <div className="md:col-span-4">
                                    <input
                                      type="text"
                                      placeholder="Option Label"
                                      value={opt.label || ''}
                                      onChange={(e) => handleOptionFieldChange(sIdx, qIdx, oIdx, 'label', e.target.value)}
                                      className="w-full text-xs font-medium px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#087F8C] focus:border-[#087F8C] focus:outline-none"
                                    />
                                  </div>

                                  <div className="md:col-span-3">
                                    <input
                                      type="text"
                                      placeholder="Helper description (optional)"
                                      value={opt.description || ''}
                                      onChange={(e) => handleOptionFieldChange(sIdx, qIdx, oIdx, 'description', e.target.value)}
                                      className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#087F8C] focus:border-[#087F8C] focus:outline-none"
                                    />
                                  </div>

                                  <div className="md:col-span-2">
                                    <select
                                      value={opt.deductionType || 'percentage'}
                                      onChange={(e) => handleOptionFieldChange(sIdx, qIdx, oIdx, 'deductionType', e.target.value)}
                                      className="w-full text-xs px-2 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#087F8C] focus:border-[#087F8C] focus:outline-none"
                                    >
                                      <option value="percentage">% Percentage</option>
                                      <option value="flat_inr">₹ Flat INR</option>
                                    </select>
                                  </div>

                                  <div className="md:col-span-2 flex items-center gap-1">
                                    <span className="text-xs text-slate-500 font-bold">
                                      {opt.deductionType === 'flat_inr' ? '₹' : '%'}
                                    </span>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      value={opt.deductionValue ?? 0}
                                      onChange={(e) => handleOptionFieldChange(sIdx, qIdx, oIdx, 'deductionValue', parseFloat(e.target.value) || 0)}
                                      className="w-full text-xs font-semibold px-2 py-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-[#087F8C] focus:border-[#087F8C] focus:outline-none"
                                    />
                                  </div>

                                  <div className="md:col-span-1 flex justify-end">
                                    <button
                                      onClick={() => handleDeleteOption(sIdx, qIdx, oIdx)}
                                      className="text-slate-400 hover:text-red-500 p-1"
                                      title="Remove option"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add Question Button */}
                      <button
                        type="button"
                        onClick={() => handleAddQuestion(sIdx)}
                        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-[#087F8C] text-slate-600 hover:text-[#087F8C] hover:bg-[#E8F6F7]/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add Question to {step.label}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add New Step Section */}
          <button
            type="button"
            onClick={handleAddStep}
            className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-slate-300 hover:border-[#087F8C] text-slate-600 hover:text-[#087F8C] bg-white hover:bg-[#E8F6F7]/40 rounded-xl text-sm font-semibold transition shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#087F8C]" />
            Add New Step Section
          </button>
        </div>
      )}
    </div>
  );
}
