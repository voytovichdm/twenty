import { useContext } from 'react';

import { useRecordFieldValue } from '@/object-record/record-store/contexts/RecordFieldValueSelectorContext';

import { FieldContext } from '../../contexts/FieldContext';

export const useTextFieldDisplay = () => {
  const { entityId, fieldDefinition, hotkeyScope } = useContext(FieldContext);

  const fieldName = fieldDefinition.metadata.fieldName;

  const fieldValue =
    useRecordFieldValue<string | undefined>(entityId, fieldName) ?? '';

  return {
    fieldDefinition,
    fieldValue,
    hotkeyScope,
  };
};
