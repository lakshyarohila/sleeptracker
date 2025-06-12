'use client';
import { useRef, useState } from 'react';

const AddRecord = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [amount, setAmount] = useState(6); // Default value for the slider
  const [alertMessage, setAlertMessage] = useState<string | null>(null); // State for alert message
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null); // State for alert type
  const [isLoading, setIsLoading] = useState(false); // State for loading spinner
  const [sleepQuality, setSleepQuality] = useState(''); // State for selected sleep quality

  const clientAction = async (formData: FormData) => {
    setIsLoading(true);
    setAlertMessage(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success for demo
    setAlertMessage('Sleep record added successfully!');
    setAlertType('success');
    setAmount(6);
    setSleepQuality('');
    // Reset date field
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) dateInput.value = '';

    setIsLoading(false);
  };

  return (
      <div className='bg-gray-900 min-h-screen flex items-center justify-center p-4'>
        <div className='bg-gray-800 shadow-2xl rounded-lg p-8 w-full max-w-2xl border border-gray-700'>
          <h3 className='text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent'>
            Track Your Sleep
          </h3>
          <div className='space-y-6'>
            {/* Sleep Quality and Sleep Date */}
            <div className='flex flex-col md:flex-row md:space-x-4'>
              {/* Sleep Quality */}
              <div className='flex-1 mb-4 md:mb-0'>
                <label
                    htmlFor='text'
                    className='block text-sm font-medium text-gray-300 mb-2'
                >
                  Sleep Quality
                </label>
                <select
                    id='text'
                    name='text'
                    value={sleepQuality}
                    onChange={(e) => setSleepQuality(e.target.value)}
                    className='block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 px-4 py-2 text-white placeholder-gray-400'
                    required
                >
                  <option value='' disabled>
                    Sleep quality...
                  </option>
                  <option value='Refreshed'>🌞 Refreshed</option>
                  <option value='Tired'>😴 Tired</option>
                  <option value='Neutral'>😐 Neutral</option>
                  <option value='Exhausted'>😫 Exhausted</option>
                  <option value='Energetic'>⚡ Energetic</option>
                </select>
              </div>

              {/* Sleep Date */}
              <div className='flex-1'>
                <label
                    htmlFor='date'
                    className='block text-sm font-medium text-gray-300 mb-2'
                >
                  Sleep Date
                </label>
                <input
                    type='date'
                    name='date'
                    id='date'
                    className='block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 px-4 py-2 text-white [color-scheme:dark]'
                    placeholder='Select a date'
                    required
                    onFocus={(e) => e.target.showPicker()} // Open the calendar on focus
                />
              </div>
            </div>

            {/* Hours Slept */}
            <div>
              <label
                  htmlFor='amount'
                  className='block text-sm font-medium text-gray-300 mb-2'
              >
                Hours Slept
                <br />
                <span className='text-xs text-gray-400'>
                (Select between 0 and 12 in steps of 0.5)
              </span>
              </label>
              <input
                  type='range'
                  name='amount'
                  id='amount'
                  min='0'
                  max='12'
                  step='0.5'
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  className='w-full cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none slider-thumb'
                  style={{
                    background: `linear-gradient(to right, #8b5cf6 0%, #ec4899 ${(amount / 12) * 100}%, #374151 ${(amount / 12) * 100}%, #374151 100%)`
                  }}
              />
              <div className='text-center text-gray-300 mt-2 font-semibold text-lg'>{amount} hours</div>
            </div>

            {/* Submit Button */}
            <button
                onClick={() => {
                  const formData = new FormData();
                  formData.set('amount', amount.toString());
                  formData.set('text', sleepQuality);
                  formData.set('date', (document.getElementById('date') as HTMLInputElement)?.value || '');
                  clientAction(formData);
                }}
                className='w-full bg-gradient-to-r from-blue-600 via-pink-600 to-sky-600 hover:from-blue-700 hover:via-pink-700 hover:to-sky-700 text-white px-4 py-3 rounded-md font-medium shadow-lg transition-all duration-200 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isLoading} // Disable button while loading
            >
              {isLoading ? (
                  <svg
                      className='animate-spin h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                  >
                    <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                    ></circle>
                    <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                    ></path>
                  </svg>
              ) : (
                  'Add Sleep Record'
              )}
            </button>
          </div>

          {/* Alert Message */}
          {alertMessage && (
              <div
                  className={`mt-4 p-3 rounded-md text-sm ${
                      alertType === 'success'
                          ? 'bg-green-900 text-green-200 border border-green-700'
                          : 'bg-red-900 text-red-200 border border-red-700'
                  }`}
              >
                {alertMessage}
              </div>
          )}
        </div>
      </div>
  );
};

export default AddRecord;