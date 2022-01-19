import { createContext } from 'react';

const SuggestCtx = createContext<{
    selectedItem?: any;
    setSelectedItem: (selectedItem: any) => void;
    currentValue?: string;
}>({
    selectedItem: null,
    setSelectedItem: () => {},
    currentValue: ''
});

export default SuggestCtx;
