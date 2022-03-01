import React from 'react';
import { childrenOf, createShallowRenderer } from './shallowHelpers';

describe('childrenOf', () => {
    it('returns no children', () => {
        expect(childrenOf(<div />)).toEqual([]);
    });

    it('returns direct children', () => {
        expect(childrenOf(
            <div>
                <p>A</p>
                <p>B</p>
            </div>
        )).toEqual([<p>A</p>, <p>B</p>]);
    });

    it('returns a text as an array of one item when children is text itself', () => {
        expect(childrenOf(<div>text</div>)).toEqual(['text']);
    });

    it('returns no children for text', () => {
        expect(childrenOf('text')).toEqual([]);
    });

    it(('returns array of children for elements with one children'), () => {
        expect(childrenOf(
            <div>
                <p>A</p>
            </div>
        )).toEqual([<p>A</p>]);
    });
});

const TestComponent = ({ children }) => (
    <React.Fragment>{children}</React.Fragment>
);

describe('child', () => {
    let render, child;
    beforeEach(() => {
        ({ render, child } = createShallowRenderer());
    });

    it('returns undefined if the child does not exist', () => {
        render(<TestComponent />);
        expect(child(0)).not.toBeDefined();
    });
});
