# Form Validation System

This project includes a comprehensive form validation system using Yup schemas and React hooks.

## Installation

The following packages have been installed:

```bash
npm install react-hook-form @hookform/resolvers yup
```

## File Structure

```
inscriptions/
├── validationSchemas.ts          # Yup validation schemas
├── utils/
│   └── formValidation.ts         # Validation utilities and helpers
├── hooks/
│   └── useSimpleValidation.ts    # Simple validation hook
├── components/
│   ├── ErrorMessage.tsx          # Reusable error message component
│   └── ValidatedFormExample.tsx  # Example of validated form
└── VALIDATION_README.md          # This file
```

## Usage

### 1. Simple Validation Hook

The `useSimpleValidation` hook provides a simple way to validate forms without complex form libraries:

```typescript
import { useSimpleValidation } from '../hooks/useSimpleValidation';
import { personalInfoValidation } from '../utils/formValidation';

function MyForm() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
  });

  const { 
    errors, 
    validateFormData, 
    getFieldError, 
    hasFieldError, 
    clearFieldError 
  } = useSimpleValidation();

  const handleSubmit = async () => {
    const isValid = await validateFormData(personalInfoValidation, formData);
    if (isValid) {
      // Handle successful submission
    }
  };

  return (
    <View>
      <TextInput
        style={[styles.input, hasFieldError('nom') && styles.inputError]}
        value={formData.nom}
        onChangeText={(value) => setFormData(prev => ({ ...prev, nom: value }))}
      />
      <ErrorMessage error={getFieldError('nom')} />
    </View>
  );
}
```

### 2. Validation Schemas

Pre-defined validation schemas are available in `validationSchemas.ts`:

- `personalInfoSchema` - Personal information validation
- `contactInfoSchema` - Contact information validation
- `cvSchema` - CV file validation
- `academicPathSchema` - Academic path validation
- `notesSchema` - Notes file validation
- `experienceSchema` - Professional experience validation
- `justificatifsSchema` - Supporting documents validation

### 3. Validation Utilities

Helper functions for common validation tasks:

```typescript
import { 
  validateEmail, 
  validatePhone, 
  validateRequired,
  validateMinLength,
  validateMaxLength 
} from '../utils/formValidation';

// Email validation
const emailError = validateEmail('test@example.com');

// Phone validation (French format)
const phoneError = validatePhone('0612345678');

// Required field validation
const requiredError = validateRequired('', 'Nom');

// Length validation
const minLengthError = validateMinLength('ab', 3, 'Nom');
const maxLengthError = validateMaxLength('very long text', 10, 'Description');
```

### 4. Error Message Component

The `ErrorMessage` component displays validation errors:

```typescript
import ErrorMessage from '../components/ErrorMessage';

<ErrorMessage error="Ce champ est obligatoire" />
```

## Integration with Existing Form

To integrate validation with your existing form in `app/file/index.tsx`:

1. **Import the validation utilities:**
```typescript
import { useSimpleValidation } from '../../hooks/useSimpleValidation';
import { personalInfoValidation } from '../../utils/formValidation';
import ErrorMessage from '../../components/ErrorMessage';
```

2. **Add validation state:**
```typescript
const { errors, validateFormData, getFieldError, hasFieldError } = useSimpleValidation();
```

3. **Update form fields with validation:**
```typescript
<TextInput
  style={[styles.input, hasFieldError('nom') && styles.inputError]}
  value={nom}
  onChangeText={setNom}
  onBlur={() => validateFormData(personalInfoValidation, { nom, prenom, ... })}
/>
<ErrorMessage error={getFieldError('nom')} />
```

4. **Add validation to navigation:**
```typescript
const goNext = async () => {
  if (currentPage < PAGES.length - 1) {
    let isValid = true;
    
    switch (PAGES[currentPage].key) {
      case "infos":
        isValid = await validateFormData(personalInfoValidation, personalInfoData);
        break;
      // ... other cases
    }
    
    if (isValid) {
      setCurrentPage(currentPage + 1);
    } else {
      Alert.alert("Erreur de validation", "Veuillez corriger les erreurs avant de continuer.");
    }
  }
};
```

## Validation Features

- **Real-time validation** on field blur
- **Form-level validation** on submission
- **Custom error messages** in French
- **File validation** for uploads (size, type)
- **Conditional validation** based on other fields
- **Phone number validation** for French format
- **Email validation** with proper format checking

## Example

See `components/ValidatedFormExample.tsx` for a complete working example of form validation.

## Custom Validation Rules

You can create custom validation rules by extending the Yup schemas:

```typescript
import * as yup from 'yup';

const customSchema = yup.object().shape({
  customField: yup.string()
    .required('Ce champ est obligatoire')
    .test('custom', 'Validation personnalisée', (value) => {
      // Your custom validation logic
      return value && value.length > 5;
    }),
});
``` 