import { FC, useCallback, useContext, useMemo } from 'react';

import SuggestCtx from '../../context/SuggestCtx';
import type { Markup } from './types';

export type SuggestElemProps = {
    markup?: Markup;
    item: string;
};

const SuggestDefaultElem: Markup['Elem'] = props => (
    <li
        onClick={props.onClick}
        className={props.isSelected ? 'selected' : undefined}
        dangerouslySetInnerHTML={props.dangerouslySetInnerHTML}
    />
);

const SuggestElem: FC<SuggestElemProps> = props => {
    const { markup, item } = props;
    const { selectedItem, setSelectedItem, currentValue } = useContext(SuggestCtx);
    const Markup = useMemo(() => ({
        Elem: markup?.Elem || SuggestDefaultElem
    }), [markup]);
    const onClick = useCallback(() => {
        setSelectedItem(item);
    }, [item, setSelectedItem]);

    return (
        <Markup.Elem
            isSelected={selectedItem === item}
            onClick={onClick}
            dangerouslySetInnerHTML={{__html: currentValue ?
                item.replace(currentValue, `<b>${currentValue}</b>`) :
                item
            }}
        />
    );
};

export default SuggestElem;
