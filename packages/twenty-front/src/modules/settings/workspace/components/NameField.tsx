import { useCallback, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { useDebouncedCallback } from 'use-debounce';

import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { TextInput } from '@/ui/input/components/TextInput';
import { useUpdateWorkspaceMutation } from '~/generated/graphql';
import { isDefined } from '~/utils/isDefined';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';
import { logError } from '~/utils/logError';

const StyledComboInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  > * + * {
    margin-left: ${({ theme }) => theme.spacing(4)};
  }
`;

type NameFieldProps = {
  autoSave?: boolean;
  onNameUpdate?: (name: string) => void;
};

export const NameField = ({
  autoSave = true,
  onNameUpdate,
}: NameFieldProps) => {
  const currentWorkspace = useRecoilValue(currentWorkspaceState);

  const [displayName, setDisplayName] = useState(
    currentWorkspace?.displayName ?? '',
  );

  const [updateWorkspace] = useUpdateWorkspaceMutation();

  // TODO: Enhance this with react-web-hook-form (https://www.react-hook-form.com)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdate = useCallback(
    useDebouncedCallback(async (name: string) => {
      if (isDefined(onNameUpdate)) {
        onNameUpdate(displayName);
      }
      if (!autoSave || !name) {
        return;
      }
      try {
        const { data, errors } = await updateWorkspace({
          variables: {
            input: {
              displayName: name,
            },
          },
        });

        if (isDefined(errors) || isUndefinedOrNull(data?.updateWorkspace)) {
          throw errors;
        }
      } catch (error) {
        logError(error);
      }
    }, 500),
    [updateWorkspace],
  );

  useEffect(() => {
    debouncedUpdate(displayName);
    return debouncedUpdate.cancel;
  }, [debouncedUpdate, displayName]);

  return (
    <StyledComboInputContainer>
      <TextInput
        label="Name"
        value={displayName}
        onChange={setDisplayName}
        placeholder="Apple"
        fullWidth
      />
    </StyledComboInputContainer>
  );
};
