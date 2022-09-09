import { useEffect } from 'react';

import { FieldErrorsImpl, FieldValues } from 'react-hook-form';

export const useFocusFirstInput = <C extends FieldValues>(
    errors: FieldErrorsImpl<C>,
    setFocus: any,
) => {
    useEffect(() => {
        type KeyError = keyof typeof errors;
        const firstError = (
            Object.keys(errors) as Array<KeyError>
        ).reduce<KeyError | null>((field, a) => {
            const fieldKey = field as KeyError;
            return !!errors[fieldKey] ? fieldKey : a;
        }, null);

        if (firstError) {
            setFocus(firstError);
        }
    }, [setFocus, errors]);
};
