import React from 'react';

interface LikertScaleProps {
  value: number | null;
  onChange: (value: number) => void;
  name: string;
  disabled?: boolean;
  dontKnow?: boolean;
  onDontKnowChange?: (checked: boolean) => void;
}

export default function LikertScale({ value, onChange, name, disabled, dontKnow, onDontKnowChange, touched }: LikertScaleProps & { touched?: boolean }) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex w-full justify-between items-center text-xs mb-1">
        <span className="text-gray-600">Helemaal mee oneens</span>
        <span className="text-gray-600">Helemaal mee eens</span>
      </div>
      {/* nvt checkbox links van de track, op gelijke hoogte */}
      <div className="flex flex-row items-center w-full mb-2 gap-2">
        <span className="flex items-center">
          <input
            type="checkbox"
            id={`dontknow_${name}`}
            checked={!!dontKnow}
            onChange={e => onDontKnowChange && onDontKnowChange(e.target.checked)}
            className="mr-1"
            style={{ width: 20, height: 20 }}
          />
          <label htmlFor={`dontknow_${name}`} className="text-gray-600 text-base select-none">nvt.</label>
        </span>
        <div className="flex-1">
          {/* Cijfers boven de slider */}
          <div className="flex w-full justify-between px-2 mb-1 select-none">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className={`text-gray-500 text-xs${touched && value === i+1 ? ' font-bold' : ''}`}
                style={{minWidth: 16, textAlign: 'center'}}>
                {i+1}
              </span>
            ))}
          </div>
          <div className="flex flex-col items-center w-full">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={value ?? 5}
              onChange={e => onChange(Number(e.target.value))}
              name={name}
              disabled={disabled || dontKnow}
              className={`w-full likert-slider ${touched ? 'touched' : ''}`}
              style={{
                height: '48px',
                background: 'transparent',
                ...(touched && value ? { ['--percent' as any]: `${((value-1)/9)*100}%` } : { ['--percent' as any]: '0%' })
              }}
            />
            <style>{`
              input[type='range'] {
                -webkit-appearance: none;
                width: 100%;
                height: 24px;
                background: transparent;
                margin: 0;
              }
              input[type='range']::-webkit-slider-runnable-track {
                height: 24px;
                border-radius: 12px;
                background: #d1d5db;
                position: relative;
              }
              input[type='range'].touched::-webkit-slider-runnable-track {
                background: linear-gradient(to right, #3b82f6 0%, #3b82f6 calc(var(--percent, 0%) + 0.1%), #d1d5db calc(var(--percent, 0%) + 0.1%), #d1d5db 100%);
              }
              input[type='range']::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #fff;
                border: 4px solid #6b7280;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                cursor: pointer;
                transition: border-color 0.2s;
                margin-top: -12px;
              }
              input[type='range']:not(:disabled)::-webkit-slider-thumb {
                border: 4px solid #2563eb;
              }
              input[type='range']::-moz-range-track {
                height: 24px;
                border-radius: 12px;
                background: #d1d5db;
              }
              input[type='range'].touched::-moz-range-track {
                background: linear-gradient(to right, #3b82f6 0%, #3b82f6 calc(var(--percent, 0%) + 0.1%), #d1d5db calc(var(--percent, 0%) + 0.1%), #d1d5db 100%);
              }
              input[type='range']::-moz-range-thumb {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: #fff;
                border: 4px solid #6b7280;
                box-shadow: 0 2px 8px rgba(0,0,0,0.10);
                cursor: pointer;
                transition: border-color 0.2s;
              }
              input[type='range']:not(:disabled)::-moz-range-thumb {
                border: 4px solid #2563eb;
              }
              .likert-slider {
                background: #fff !important;
                padding: 0 0;
              }
            `}</style>
          </div>
        </div>
      </div>
    </div>
  );
}
