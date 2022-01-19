import type { FC, ForwardRefRenderFunction, DOMAttributes } from 'react';

export type InputProps = JSX.IntrinsicElements['input'];

export type Loader = {
    // at the moment we have no transformers support, so data format is constant
    data?: string[];
    search?: (value: string) => void;
    // I have no time to implement paginated data
    pagination?: {
        next: () => void;
        hasNext: boolean;
    };
    isLoading?: boolean;
};

// initial design was contain validation of input value before applying it to filter function but I have no time to implement it
export type Validator = {
    isValid: (value?: string) => boolean;
};

// its better to allow to set className without passing whole Components
export type Markup = {
    Input?: ForwardRefRenderFunction<HTMLInputElement, InputProps>;
    Wrapper?: FC;
    Elem?: FC<{
        selectedItem?: any;
        isSelected?: boolean;
        onClick: () => void;
        dangerouslySetInnerHTML: DOMAttributes<HTMLElement>['dangerouslySetInnerHTML']
    }>;
    Loader?: FC;
};
