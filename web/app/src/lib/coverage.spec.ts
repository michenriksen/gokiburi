import { renderProfile } from '$lib/coverage';
import { describe, expect, it } from 'vitest';

import type { Profile } from '$lib/common/types';

const subject = `
package shapes

// Rect represents a rectangle shape.
type Rect struct {
    width, height int
}

// Area of the rectangle.
func (r *Rect) Area() int {
    return r.width * r.height
}

// Perimeter of the rectangle.
//
// a bit of <strong>HTML</strong> for some reason.
func (r Rect) Perimeter() int {
    return 2*r.width + 2*r.height
}

// Angles returns number of angles in a rectangle.
func (r Rect) Angles() int {
    return 4;
}
`;

const expected = `
package shapes

&#x2F;&#x2F; Rect represents a rectangle shape.
type Rect struct {
    width, height int
}

&#x2F;&#x2F; Area of the rectangle.
func (r *Rect) Area() int <span class="gokiburi-cov gokiburi-cov-3" data-cov-level="3" data-cov-count="2">{
    return r.width * r.height
}</span>

&#x2F;&#x2F; Perimeter of the rectangle.
&#x2F;&#x2F;
&#x2F;&#x2F; a bit of &lt;strong&gt;HTML&lt;&#x2F;strong&gt; for some reason.
func (r Rect) Perimeter() int <span class="gokiburi-cov gokiburi-cov-2" data-cov-level="2" data-cov-count="1">{
    return 2*r.width + 2*r.height
}</span>

&#x2F;&#x2F; Angles returns number of angles in a rectangle.
func (r Rect) Angles() int <span class="gokiburi-cov gokiburi-cov-0" data-cov-level="0" data-cov-count="0">{
    return 4;
}</span>
`;

describe('renderProfile', () => {
	it('renders file contents with coverage blocks', () => {
		const profile: Profile = {
			filename: 'shapes/rectangle.go',
			package: 'shapes',
			path: '~/src/project/shapes/rectangle.go',
			content: window.btoa(subject),
			size: subject.length,
			coverage: 100,
			boundaries: [
				{
					offset: 151, // Opening `{` of Area method.
					start: true,
					count: 2,
					norm: 0.3,
					index: 0
				},
				{
					offset: 184, // Closing `}` of Area method.
					start: false,
					count: 0,
					norm: 0,
					index: 1
				},
				{
					offset: 301, // Opening `{` of Perimiter method.
					start: true,
					count: 1,
					norm: 0.2,
					index: 2
				},
				{
					offset: 338, // Closing `}` of Perimeter method.
					start: false,
					count: 0,
					norm: 0,
					index: 3
				},
				{
					offset: 418, // Opening `{` of Angles method.
					start: true,
					count: 0,
					norm: 0,
					index: 4
				},
				{
					offset: 435, // Closing `}` of Angles method.
					start: false,
					count: 0,
					norm: 0,
					index: 5
				}
			]
		};

		expect(renderProfile(profile)).toEqual(expected);
	});
});
