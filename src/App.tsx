import React, { useCallback, useState } from 'react';

import Suggest, { InputProps, Markup } from './components/Suggest';

const ExampleWrapper: React.FC = ({ children }) => {
    return (
        <div>
            Suggestions are:
            <ul style={{ border: '1px solid #000' }}>{children}</ul>
        </div>
    );
}

const ExampleElement: Markup['Elem'] = props => {
    const { isSelected, onClick, dangerouslySetInnerHTML } = props;

    return (
        <li
            onClick={onClick}
            className={isSelected ? 'selected' : undefined} style={{ fontWeight: 700 }}
            dangerouslySetInnerHTML={dangerouslySetInnerHTML}
        />
    );
}

const ExampleInput: React.ForwardRefRenderFunction<HTMLInputElement, InputProps> = ((props, ref) => (
    // user MUST pass InputProps to inner <input />
    <div style={{ border: '1px solid red' }}>
        <input {...props} ref={ref} />
    </div>
));

const EXAMPLE_DATA = new Map<string, string[]>([
    ['a', ['a', 'abc', 'abcd']],
    ['foo', ['foo', 'foobar', 'foobarbaz']]
]);

const EXAMPLE_DATA_KEYS = Array.from(EXAMPLE_DATA.keys());

const useExampleLoader = () => {
    const [data, setData] = useState<string[]>([]);
    const [isLoading, setLoading] = useState(false);

    // assume this function is written by user and prevent race conditions
    const search = useCallback((input: string = '') => {
        const key = EXAMPLE_DATA_KEYS.find(key => input.startsWith(key));
        const slice = (key && EXAMPLE_DATA.get(key)) || [];

        setLoading(true);
        setTimeout(() => {
            setData(slice.filter(elem => elem.startsWith(input)));
            setLoading(false);
        }, Math.round(Math.random() * 1000));
    }, []);

    return { data, search, isLoading };
};

const FullExample: React.FC = () => {
    const loader = useExampleLoader();
    const [selected, setSelected] = useState('');

    const onSelect = useCallback((value: string) => {
        setSelected(value);
    }, []);

    return (
        <label>With data and custom design. Selected value is {selected}
            <Suggest
                loader={loader}
                placeholder="Start typing a or foo"
                markup={{
                    Elem: ExampleElement,
                    Wrapper: ExampleWrapper,
                    Input: ExampleInput
                }}
                onSelect={onSelect}
            />
        </label>
    )
}

function App() {
    return (
        <>
            <section>
                <label>With data
                    <Suggest
                        loader={{
                            data: EXAMPLE_DATA.get('foo')
                        }}
                    />
                </label>
            </section>
            <section>
                <FullExample />
            </section>
        </>
    );
}

export default App;
