import { FC, useMemo } from 'react';

import SuggestElem from './Elem';

import type { Markup, Loader } from './types';

export type SuggestListProps = {
    markup?: Markup;
    isVisible?: boolean;
    loader?: Loader;
};

const SuggestList: FC<SuggestListProps> = props => {
    const { markup, isVisible, loader } = props;
    const Markup = useMemo(() => ({
        Wrapper: markup?.Wrapper || 'ul',
    }), [markup]);

    return (
        <>
            {(isVisible && loader?.data?.length) ? <Markup.Wrapper>
                {loader.data.map(elem => (
                    <SuggestElem item={elem} key={elem} />
                ))}
            </Markup.Wrapper> : null}
        </>
    );
};

export default SuggestList;
