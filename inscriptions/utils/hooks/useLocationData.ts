import { useState } from 'react';

const countries = ["France"];

const guadeloupeDepartments = ["Guadeloupe"];

const guadeloupeCities = [
  "Basse-Terre", "Pointe-à-Pitre", "Les Abymes", "Baie-Mahault", "Le Gosier",
  "Petit-Bourg", "Sainte-Anne", "Capesterre-Belle-Eau", "Lamentin", "Gourbeyre",
  "Bouillante", "Deshaies", "Terre-de-Haut", "Terre-de-Bas", "Vieux-Habitants",
  "Trois-Rivières", "Goyave", "Petit-Canal", "Anse-Bertrand", "Port-Louis",
  "Le Moule", "Saint-François", "Sainte-Rose", "Pointe-Noire"
];

export function useLocationData() {
  const [countryInput, setCountryInput] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [departmentInput, setDepartmentInput] = useState("");
  const [showDepartmentSuggestions, setShowDepartmentSuggestions] = useState(false);
  const [birthCityInput, setBirthCityInput] = useState("");
  const [showBirthCitySuggestions, setShowBirthCitySuggestions] = useState(false);
  const [currentCityInput, setCurrentCityInput] = useState("");
  const [showCurrentCitySuggestions, setShowCurrentCitySuggestions] = useState(false);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(countryInput.toLowerCase())
  );

  const filteredDepartments = guadeloupeDepartments.filter(dept =>
    dept.toLowerCase().includes(departmentInput.toLowerCase())
  );

  const filteredBirthCities = guadeloupeCities.filter(city =>
    city.toLowerCase().includes(birthCityInput.toLowerCase())
  );

  const filteredCurrentCities = guadeloupeCities.filter(city =>
    city.toLowerCase().includes(currentCityInput.toLowerCase())
  );

  const handleCountryInputChange = (text: string) => {
    setCountryInput(text);
    setShowCountrySuggestions(text.length > 0);
  };

  const handleDepartmentInputChange = (text: string) => {
    setDepartmentInput(text);
    setShowDepartmentSuggestions(text.length > 0);
  };

  const handleBirthCityInputChange = (text: string) => {
    setBirthCityInput(text);
    setShowBirthCitySuggestions(text.length > 0);
  };

  const handleCurrentCityInputChange = (text: string) => {
    setCurrentCityInput(text);
    setShowCurrentCitySuggestions(text.length > 0);
  };

  const selectCountry = (country: string) => {
    setCountryInput(country);
    setShowCountrySuggestions(false);
  };

  const selectDepartment = (department: string) => {
    setDepartmentInput(department);
    setShowDepartmentSuggestions(false);
  };

  const selectBirthCity = (city: string) => {
    setBirthCityInput(city);
    setShowBirthCitySuggestions(false);
  };

  const selectCurrentCity = (city: string) => {
    setCurrentCityInput(city);
    setShowCurrentCitySuggestions(false);
  };

  return {
    // Country
    countryInput,
    setCountryInput,
    showCountrySuggestions,
    setShowCountrySuggestions,
    filteredCountries,
    handleCountryInputChange,
    selectCountry,
    
    // Department
    departmentInput,
    setDepartmentInput,
    showDepartmentSuggestions,
    setShowDepartmentSuggestions,
    filteredDepartments,
    handleDepartmentInputChange,
    selectDepartment,
    
    // Birth City
    birthCityInput,
    setBirthCityInput,
    showBirthCitySuggestions,
    setShowBirthCitySuggestions,
    filteredBirthCities,
    handleBirthCityInputChange,
    selectBirthCity,
    
    // Current City
    currentCityInput,
    setCurrentCityInput,
    showCurrentCitySuggestions,
    setShowCurrentCitySuggestions,
    filteredCurrentCities,
    handleCurrentCityInputChange,
    selectCurrentCity,
  };
}
