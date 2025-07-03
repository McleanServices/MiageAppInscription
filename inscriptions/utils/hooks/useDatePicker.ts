import { useState } from 'react';
import { Platform } from 'react-native';

export function useDatePicker(initialDate?: Date) {
  const [selectedDate, setSelectedDate] = useState<Date>(initialDate || new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const confirmIOSDate = () => {
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return {
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    handleDateChange,
    confirmIOSDate,
    formatDate,
  };
}
