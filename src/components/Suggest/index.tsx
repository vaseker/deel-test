import {
    FC,
    forwardRef,
    useRef,
    useCallback,
    useMemo, useState, KeyboardEventHandler, useEffect, ChangeEvent
} from 'react';

import useDebounce from '../../hooks/useDebounce';
import SuggestCtx from '../../context/SuggestCtx';

import SuggestList from './List';
import type { InputProps, Loader, Markup } from './types';

export * from './types';

type Props = {
    loader?: Loader;
    markup?: Markup;
    defaultValue?: InputProps['defaultValue'];
    placeholder?: InputProps['placeholder'];
    inputDebounce?: number;
    onSelect?: (elem: string) => void;
};

const SuggestInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => <input {...props} ref={ref} />);
const SuggestDefaultLoader: FC = () => (
    <div>Loading...</div>
);

const Suggest: FC<Props> = props => {
    const { loader, markup, placeholder, inputDebounce = 200, onSelect } = props;
    const prevData = useRef(loader?.data || []);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSuggestVisible, setSuggestVisibility] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>('');
    const Markup = useMemo(() => ({
        Input: markup?.Input ? forwardRef(markup.Input) : SuggestInput,
        Loader: markup?.Loader || SuggestDefaultLoader
    }), [markup?.Input, markup?.Loader]);

    const applyValue = useCallback((value: string) => {
        loader?.search?.(value);
    }, [loader]);

    // we dont want to cause ddos by immediate call of filter function
    const debouncedApplyValue = useDebounce(applyValue, inputDebounce);

    const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;

        setCurrentValue(value);
        debouncedApplyValue(value);
    }, [debouncedApplyValue]);

    const onFocus = useCallback(() => {
        setSuggestVisibility(true);
    }, []);

    const [selectedItem, setSelectedItem] = useState<any>(null);

    const chooseSuggestedItem = useCallback((value: string) => {
        setSelectedItem(value);
        setCurrentValue(value);
        setSuggestVisibility(false);
        onSelect?.(value);
    }, [onSelect]);

    const getCurrentIndex = useCallback(() => {
        return (selectedItem && loader?.data) ? loader.data.indexOf(selectedItem) : -1;
    }, [loader?.data, selectedItem]);

    const moveCurrentIndex = useCallback((dir?: 'forward' | 'backward') => {
        if (!loader?.data) {
            return;
        }

        let nextIndex = getCurrentIndex();

        if (dir === 'backward') {
            if (--nextIndex < 0) {
                nextIndex = loader.data.length - 1;
            }
        } else {
            if (++nextIndex >= loader.data.length) {
                nextIndex = 0;
            }
        }

        const nextItem = loader.data[nextIndex];

        setSelectedItem(nextItem);
        setCurrentValue(nextItem);
    }, [getCurrentIndex, loader?.data, setSelectedItem]);

    const onKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(ev => {
        switch (ev.code) {
            case 'Escape':
                setSuggestVisibility(false);
                break;
            case 'ArrowDown':
                moveCurrentIndex();
                break;
            case 'ArrowUp':
                moveCurrentIndex('backward');
                break;
            case 'Enter':
                chooseSuggestedItem(selectedItem || currentValue);
                break;
            default: break;
        }
    }, [moveCurrentIndex, chooseSuggestedItem, selectedItem, currentValue]);

    useEffect(() => {
        if (loader?.data !== prevData.current) {
            prevData.current = loader?.data || [];
            setSelectedItem('');
        }

    }, [loader?.data])

    // TODO: support a11y https://react-spectrum.adobe.com/react-aria/index.html

    return (
        <>
            <Markup.Input
                placeholder={placeholder}
                ref={inputRef}
                value={currentValue}
                onFocus={onFocus}
                onChange={onChange}
                onKeyUp={onKeyPress}
            />
            {loader?.isLoading && <Markup.Loader />}
            <SuggestCtx.Provider value={{
                selectedItem,
                setSelectedItem: chooseSuggestedItem,
                currentValue
            }}>
                {/* TODO: close suggest on outside click */}
                <SuggestList
                    isVisible={isSuggestVisible}
                    markup={markup}
                    loader={loader}
                />
            </SuggestCtx.Provider>
        </>
    );
};

export default Suggest;
