/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { render } from 'spec/helpers/testing-library';
import CardCollection from './CardCollection';

function getInjectedCSS(): string {
  const rules: string[] = [];
  Array.from(document.styleSheets).forEach(sheet => {
    try {
      Array.from(sheet.cssRules).forEach(rule => {
        rules.push(rule.cssText);
      });
    } catch {
      // cross-origin sheets – skip
    }
  });
  return rules.join('\n');
}

const minimalProps = {
  loading: false,
  prepareRow: jest.fn(),
  renderCard: () => <div>card</div>,
  rows: [] as never[],
};

test('grid-template-columns uses minmax(min(300px,100%),1fr) to prevent overflow on narrow viewports', () => {
  render(<CardCollection {...minimalProps} />);
  const css = getInjectedCSS();
  expect(css).toMatch(/grid-template-columns:.*minmax\(min\(300px,\s*100%\)/);
});

test('applies reduced padding at the 576px mobile breakpoint', () => {
  render(<CardCollection {...minimalProps} />);
  const css = getInjectedCSS();
  expect(css).toMatch(/@media\s*\(max-width:\s*576px\)/);
});
