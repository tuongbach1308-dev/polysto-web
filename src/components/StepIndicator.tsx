import { Check } from "lucide-react";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number; // 0-indexed
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="step-indicator py-4">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        const isLast = i === steps.length - 1;

        return (
          <div key={step} className="flex items-center">
            {/* Circle */}
            <div className="flex flex-col items-center">
              <div
                className={`step-circle ${
                  isCompleted
                    ? "completed"
                    : isActive
                    ? "active"
                    : "inactive"
                }`}
              >
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  <span>{i + 1}</span>
                )}
              </div>
              <span
                className={`body-3 mt-1.5 whitespace-nowrap ${
                  isActive
                    ? "text-primary-500 font-semibold"
                    : isCompleted
                    ? "text-green-600 font-medium"
                    : "text-third-200"
                }`}
              >
                {step}
              </span>
            </div>

            {/* Line */}
            {!isLast && (
              <div
                className={`step-line mx-1 sm:mx-2 mb-5 ${
                  isCompleted
                    ? "completed"
                    : isActive
                    ? "active"
                    : "inactive"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
