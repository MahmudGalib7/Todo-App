import React from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Todo } from '../types';

interface CalendarProps {
  todos: Todo[];
  onTodoClick: (todo: Todo) => void;
}

const Calendar: React.FC<CalendarProps> = ({ todos, onTodoClick }) => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const todosByDate: { [key: string]: Todo[] } = {};

  todos.forEach(todo => {
    if (todo.dueDate) {
      const date = new Date(todo.dueDate);
      if (date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
        const key = date.getDate().toString();
        todosByDate[key] = todosByDate[key] || [];
        todosByDate[key].push(todo);
      }
    }
  });

  return (
    <div className="dashboard-section">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          <CalendarIcon className="inline-block mr-2 text-violet-600 dark:text-violet-400" size={24} />
          {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600 dark:text-gray-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array(firstDayWeekday).fill(null).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {days.map(day => {
          const isToday = day === today.getDate();
          const hasTodos = todosByDate[day.toString()]?.length > 0;

          return (
            <motion.div
              key={day}
              whileHover={{ scale: hasTodos ? 1.05 : 1 }}
              className={`aspect-square p-1 ${hasTodos ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`h-full rounded-lg ${
                  isToday
                    ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-900 dark:text-violet-100'
                    : hasTodos
                    ? 'bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                } p-1`}
              >
                <div className="text-sm font-medium mb-1 dark:text-gray-300">{day}</div>
                {hasTodos && (
                  <div className="space-y-1">
                    {todosByDate[day.toString()].map(todo => (
                      <motion.div
                        key={todo.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onTodoClick(todo)}
                        className={`text-xs p-1 rounded ${
                          todo.priority === 'high'
                            ? 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200'
                            : 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200'
                        } truncate`}
                      >
                        {todo.text}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;